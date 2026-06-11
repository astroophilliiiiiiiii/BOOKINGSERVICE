import express, { Request , Response , NextFunction } from "express"
import { createBookingHandler, confirmBookingHandler } from "../../controllers/booking.controller.js"
import { validateRequestBody } from "../../validators/index.js";
import { createBookingSchema } from "../../validators/booking.validator.js";

const bookingRouter = express.Router() ; 
   
bookingRouter.post("/" , validateRequestBody(createBookingSchema) , createBookingHandler ) ; 
bookingRouter.post( "/confirm/:idempotencyKey" , confirmBookingHandler ) ; 

export default bookingRouter ; 


