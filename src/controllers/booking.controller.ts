import { Request , Response } from "express" 
import { createBookingService , confirmBookingService } from "../service/booking.service.js"

export const createBookingHandler = async ( req:Request , res:Response ) => {
    // call the service layeerr 
    const booking  = await createBookingService( req.body ) ; 

    // send the response 
    res.status(201).json({
        bookingId : booking.bookingId , 
        idempotencyKey : booking.idempotencyKey
    })
}


export const confirmBookingHandler = async ( req:Request , res:Response ) => {
    // call the service layeerr 
    const booking  = await confirmBookingService( req.params.idempotencyKey as string ) ; 
    
    // send the response 
    res.status(201).json({
        bookingId : booking.id , 
        status : booking.status
    })
}

