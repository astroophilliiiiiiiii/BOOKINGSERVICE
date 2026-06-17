// for the notification input data validation and type checking
export interface NotificationDto {
    to: string;
    subject: string;
    templateId: string;
    params: Record<string, any>; //key-value pairs to populate in the template
}   


