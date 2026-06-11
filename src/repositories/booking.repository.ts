import { Prisma } from "@prisma/client";
import prismaClient from "../prisma/client.js"
import { Booking  , BookingStatus } from "@prisma/client";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.js"

// booking data aayegaa and ussee humne prisma client ke through query kiyaa 
// humaarree bookings model pe ... ( create -- entry created in our table )
// BookingCreateInput -- automatic type created by the npx prisma generate ( also generates types + client ( jispe query we do ))
export async function createBooking( bookingInput : Prisma.BookingCreateInput ){
    const booking = await prismaClient.booking.create({
        data : bookingInput
    })

    return booking ; 
}

// idempotency key needed -- imported by utils folder -- generateIdempotencyKey ------------
// key -- uuid          string -- booking id to map ( uuid to bookingid )
export async function createIdempotencyKey( key : string , bookingId : number ){
        const idempotencyKey = await prismaClient.idempotencyKey.create({
            data:{ key , 
                booking : {
                    connect : { id : bookingId }
                }
             }
        })

        return idempotencyKey ; 
}

export async function getIdempotencyKey( key : string ){
    const idempotencyKey = await prismaClient.idempotencyKey.findUnique({
        where :{
            key
        }
    })

    return idempotencyKey ; 
}

export async function getBookingById( id : number ){
    const booking = await prismaClient.booking.findUnique({
        where :{
            id
        }
    })

    return booking ; 
}

export async function confirmBooking( id : number ){
    const booking = await prismaClient.booking.update({
        where :{
            id
        }, 
        data:{
            status : BookingStatus.CONFIRMED
        }
    })

    return booking ;
}


export async function cancelBooking( id : number ){
    const booking = await prismaClient.booking.update({
        where :{
            id
        }, 
        data:{
            status : BookingStatus.CANCELLED
        }
    })

    return booking ;
}

export async function finalizeIdempotencyKey( key : string ){
     const idempotencyKey = await prismaClient.idempotencyKey.update({
        where :{
            key
        }, 
        data : {
            finalized : true 
        }
    })

    return idempotencyKey ; 
}



