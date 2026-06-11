import { confirmBooking, createBooking , createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey  } from "../repositories/booking.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error.js";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.js";
import { CreateBookingDTO } from "../dto/booking.dto.js"
// iskaa logic goes to the repo layer 
// here we need DTO that'll accept the input data + add some buisness logic 
// some more col values then finally model Booking ready input goes to repo layer 


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



export async function confirmBookingService( idempotencyKey : string ) {
    const idempotencyKeyData = await getIdempotencyKey( idempotencyKey )

    if( !idempotencyKeyData ) throw new NotFoundError(" Idempotency key not found !! ")
    
    if( idempotencyKeyData.finalized ) throw new BadRequestError("IdempotencyKey already finalized ")

    const booking = confirmBooking( idempotencyKeyData.bookingId ) ; 
    await finalizeIdempotencyKey( idempotencyKey ) ; 

    return booking ; 
}



