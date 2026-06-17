import { Queue } from "bullmq" ; 
import { getRedisConnObject } from "../config/redis.config.js";

export const MAILER_QUEUE = "queue-mailer" ; // name of the queue 

// mailer queue object -- in this push and pop we will do !!!! 
// takes 2 parameter ( name + connection object )
export const mailerQueue = new Queue( MAILER_QUEUE , { connection : getRedisConnObject() }  ) ; 


