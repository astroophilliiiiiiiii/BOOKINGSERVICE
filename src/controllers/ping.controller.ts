import { Request , Response } from "express"
import { AppError, InternalServerError } from "../utils/errors/app.error.js"
import fs from "fs/promises"

export const pingHandler = async ( req:Request , res:Response ) =>{

   try{
        await fs.readFile("sample")
        res.status( 200 ).json({message:"Pong"}) ; 
    }catch( error ){
       throw new InternalServerError("kriti's error") ; 
    } 


}
