import { mailerQueue } from "../queues/email.queue.js";
import { NotificationDto } from "../dto/notification.dto.js";

// producing --- adding on the data 


export const MAILER_PAYLOAD = "payload:mail" ; // name of the payload for the queue

export const addEmailToQueue = async ( payload : NotificationDto  ) => {
        // payload ke name se queue mein data jayega !!! 
        await mailerQueue.add( MAILER_PAYLOAD , payload ) ; // payload name : payload 
        console.error("Email added to the queue successfully ", JSON.stringify(payload) ) ; 
}

// processor hogaa notification service kaaa 