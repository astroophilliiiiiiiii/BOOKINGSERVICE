import { confirmBooking, createBooking , createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock  } from "../repositories/booking.repository.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error.js";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.js";
import { CreateBookingDTO } from "../dto/booking.dto.js"
import {serverConfig} from "../config/index.js"
// iskaa logic goes to the repo layer 
// here we need DTO that'll accept the input data + add some buisness logic 

// imported to make the confirmBooking as a transaction + put a lock on the idempotency row 
// for same user concurrent request 
import prismaClient from "../prisma/client.js"
// for diff user concurrent request 
import { redlock } from "../config/redis.config.js";




// creating a booking properly -- entry in both the tables 
export async function createBookingService( createBookingDTO : CreateBookingDTO ) {

    const ttl = serverConfig.LOCK_TTL ; 
    // "hotel:45 , user:7" --- ese likhke aayegaa , konse user ne kis hotel room ko book kiya 
    const bookingResource = `hotel:${createBookingDTO.hotelId}` ;

    // acquire a lock -- check if its available or not -- else give an error
    // humne pehle lock leliya bina check kiye ki vo hai v available ke nahi  
    let lock ; 

    try{
        lock = await redlock.acquire( [ bookingResource ] , ttl ) ; // checking lock we r able to acquire or not 


        // ==================== ADDED LINES ====================
        // Step 2: Lock milte hi DB se pucho kya ye hotel full ho chuka hai?
        const existingBooking = await prismaClient.booking.findFirst({
            where: { hotelId: createBookingDTO.hotelId }
        });

        if (existingBooking) {
            throw new BadRequestError("This hotel is already booked!");
        }
        // ==============================================================


        // lock lene ke baad + check krne baad ( hotel full toh ni ) -- creating a booking 
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
    //}) ;
    }catch(err){
        // in case the hotel is already booked !! 
        if(err instanceof BadRequestError || err instanceof NotFoundError) {
        throw err;
        }

        // redis lock error 
        throw new InternalServerError(" Failed to acquire a lock for this resource ") ;
    }

     
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


