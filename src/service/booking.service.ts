import { confirmBooking, createBooking , createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock  } from "../repositories/booking.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error.js";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.js";
import { CreateBookingDTO } from "../dto/booking.dto.js"
// iskaa logic goes to the repo layer 
// here we need DTO that'll accept the input data + add some buisness logic 
// some more col values then finally model Booking ready input goes to repo layer 

// imported to make the confirmBooking as a transaction + put a lock on the idempotency row 
import prismaClient from "../prisma/client.js"

// creating a booking properly -- entry in both the tables 
export async function createBookingService( createBookingDTO : CreateBookingDTO ) {

        const booking = await createBooking({
            userId :  createBookingDTO.userId,
            hotelId : createBookingDTO.hotelId,
            totalGuests: createBookingDTO.totalGuests,
            bookingAmount: createBookingDTO.bookingAmount,
        });

        const idempotencyKey = generateIdempotencyKey();

        await createIdempotencyKey(idempotencyKey, booking.id);

        return {
            bookingId: booking.id,
            idempotencyKey: idempotencyKey,
        };
}


// whenever function is declared await is always written ------------------------
export async function confirmBookingService( idempotencyKey : string ) {

  // takes whole logic thats needed to be wrapped in a single transaction 
    return await prismaClient.$transaction( async ( tx )=>{
            const idempotencyKeyData = await getIdempotencyKeyWithLock( tx , idempotencyKey )

            if( !idempotencyKeyData ) throw new NotFoundError(" Idempotency key not found !! ")
            
            if( idempotencyKeyData.finalized ) throw new BadRequestError("IdempotencyKey already finalized ")
        // if( idempotencyKeyData.bookingId === null ) throw new NotFoundError("Booking id not found for this idempotency key")


            //Aapka logic bilkul solid hai! Jab aap khud booking ID pass
            //  karke idempotency key create kar rahi hain (jaise image_0a94bc.png mein dikh raha hai),
            //  toh logically wo null nahi ho sakti.Lekin TypeScript ko yeh baat nahi 
            // pata! Uska kaam hai sirf Database Schema ko dekh kar aapko warn karna.

            // ! is put to tell it will never be NULL ---
            const booking = await confirmBooking( tx , idempotencyKeyData.bookingId! ) ; 
            await finalizeIdempotencyKey( tx , idempotencyKey ) ; 

            return booking ;
    } )

     
}


