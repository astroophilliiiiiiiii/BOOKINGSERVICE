import winston from "winston"
import { getCorrelationId } from "../utils/helpers/request.helper.js";
import DailyRotateFile from "winston-daily-rotate-file";
import "winston-mongodb";
import { serverConfig } from "./index.js";

export const logger = winston.createLogger({
    // format + transport 
    format : winston.format.combine(
        winston.format.timestamp({format:"MM-DD-YYYY HH:mm:ss"}) , 
        winston.format.json() , 
        winston.format.printf(({level , message , timestamp , correlationId , ...data })=>{
            const output = { level , message , timestamp ,correlationId : getCorrelationId()  , data } ; 
            return JSON.stringify(output) ; 
        })
    ) , 
    transports : [ 
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: 'logs/application-%DATE%-app.log',
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '20m',
            maxFiles: '14d'
        }) , 
        // TODO -- mongoDb to integrate 

        new winston.transports.MongoDB({
            db : serverConfig.MONGO_URI , 
            collection : "server_logs" , 

            // 🔥 MAGIC LINE: 14 din baad logs automatic delete (14 * 24 * 60 * 60 seconds)
            expireAfterSeconds: 1209600 , 

    //Yeh option Node.js backend aur MongoDB database ke beech ke connection ko stable (mazboot) rakhta h
    //taaki baar-baar connection drop na ho aur terminal mein koi gandi si warning na aaye.
            options:{
                useUnifiedTopology: true
            }
        })
    ]
})
