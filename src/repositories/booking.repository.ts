import { Prisma } from "@prisma/client";
import prismaClient from "../prisma/client.js"
import { Booking  , BookingStatus } from "@prisma/client";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.js"
import { BadRequestError, NotFoundError } from "../utils/errors/app.error.js";

import { validate as isValidUUID } from "uuid"

// booking data aayegaa and ussee humne prisma client ke through query kiyaa 
// humaarree bookings model pe ... ( create -- entry created in our table )
// BookingCreateInput -- automatic type created by the npx prisma generate ( also generates types + client ( jispe query we do ))

// Booking table -- entry create 
export async function createBooking( bookingInput : Prisma.BookingCreateInput ){
    const booking = await prismaClient.booking.create({
        data : bookingInput
    })

    return booking ; 
}

// idempotency key needed -- imported by utils folder -- generateIdempotencyKey ------------
// key -- uuid          string -- booking id to map ( uuid to bookingid )

// idempotenncy table -- entry create 
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

// by giving uuid -- finding the idempotency table entry 
export async function getIdempotencyKeyWithLock( tx : Prisma.TransactionClient , key : string ){

    // precaution from sql injections 
    if( !isValidUUID(key) ){
        throw new BadRequestError("Invalid Idempotency Key Format ! ")
    }

    // is uuid ki entry dedoo ( whole row as a array ) and uspe lock lgaadoo 
    // array of custom object type -- whole entry of the db 
    console.log("Searching for Idempotency Key:", key);
    const idempotencyKey : Array<any> = await tx.$queryRaw`
        SELECT * FROM IdempotencyKey WHERE \`key\` = ${key} FOR UPDATE ; 
    `
    // as key is a reserved keyword so put it in backticks 

    console.log("Idempotency key with lock: ", idempotencyKey )

    // suppose it was already locked ie this was a duplicate request 
    // orr this key is invalid ----- 
    if( !idempotencyKey || idempotencyKey.length == 0 ){
        throw new NotFoundError("Idempotency key not found ")
    }

    return idempotencyKey[0] ; 
}

// by giving the id .. finding the boooking table entry 
export async function getBookingById( id : number ){
    const booking = await prismaClient.booking.findUnique({
        where :{
            id
        }
    })

    return booking ; 
}

// confirming the status 
export async function confirmBooking(  tx : Prisma.TransactionClient , id : number ){
    const booking = await tx.booking.update({
        where :{
            id
        }, 
        data:{
            status : BookingStatus.CONFIRMED
        }
    })

    return booking ;
}


// cancelling the status 
export async function cancelBooking( id : number  ){
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

// finalising the idempotency key 
export async function finalizeIdempotencyKey(  tx : Prisma.TransactionClient , key : string ){
     const idempotencyKey = await tx.idempotencyKey.update({
        where :{
            key
        }, 
        data : {
            finalized : true 
        }
    })

    return idempotencyKey ; 
}



