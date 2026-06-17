import IORedis , {Redis} from "ioredis";
import  Redlock  from "redlock";
import {serverConfig}  from "./index.js" ;


function connectToRedis(){

    try{
        let connection : Redis ;
        
        // checking the availability 
        return ()=>{
            if( !connection ){
                connection = new IORedis( serverConfig.REDIS_SERVER_URL ) ;
                return connection ; 
            }
            return connection ; // returning already existing connection object !!! 
        }

    }catch( error ){
        console.error("Error connecting to the redis server ") ; 
        throw error ; 
    }
}

export const getRedisConnObject = connectToRedis() ; 



export const redlock = new Redlock( [ getRedisConnObject ] , {
    driftFactor : 0.01 , // time in ms 
    retryCount : 10 , 
    retryDelay : 200 , // time in ms 
    retryJitter : 200 , // time in ms 
} ) ;



