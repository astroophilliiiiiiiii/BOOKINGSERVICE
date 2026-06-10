import { v4 as uuid4 } from "uuid" 
import { Request , Response , NextFunction } from "express"
import { asyncLocalStorage } from "../utils/helpers/request.helper.js";

export const attachcorrelationIdMiddleware = ( req :Request , res:Response , next:NextFunction )=>{
    const correlationId = uuid4() ; 
    req.headers['x-correlation-id'] = correlationId ; // x-correlation-id -- se access kr skte uski id 

    asyncLocalStorage.run({correlationId : correlationId } , ()=>{
        next() ; 
    })
}

