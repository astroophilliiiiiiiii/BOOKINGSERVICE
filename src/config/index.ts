import dotenv from "dotenv" ; 
dotenv.config() ; // all the variables in the .env file will be loaded into process.env

type ServerConfig = {
    PORT : number , 
    MONGO_URI : string , 
    REDIS_SERVER_URL : string ,
    LOCK_TTL : number , 
}

export const serverConfig : ServerConfig = {
    PORT : Number( process.env.PORT ) || 3000 , 
    MONGO_URI : process.env.MONGO_URI || "", 
    REDIS_SERVER_URL : process.env.REDIS_SERVER_URL || "redis://localhost:6379" ,
    LOCK_TTL : Number( process.env.LOCK_TTL ) || 60000 , // time in ms
}
