export interface AppError extends Error{
    statuscode : number ;// Error ka paas Status code ni hotaaa 
}

export class InternalServerError implements AppError{
    statuscode: number;
    message : string ;
    name : string ; 

    constructor( message : string ){
        this.statuscode = 500 , 
        this.message = message , 
        this.name  = "InternalServerError"
    }
}

export class BadRequestError implements AppError {
    statuscode: number;
    message: string;
    name: string;
    constructor(message: string) {
        this.statuscode = 400;
        this.message = message;
        this.name = "BadRequestError";
    }
}

export class NotFoundError implements AppError{
    statuscode: number;
    message: string;
    name: string;
    constructor(message: string) {
        this.statuscode = 404;
        this.message = message;
        this.name = "NotFoundError";
    }
}

export class UnauthorizedError implements AppError {
    statuscode: number;
    message: string;
    name: string;
    constructor(message: string) {
        this.statuscode = 401;
        this.message = message;
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError implements AppError {
    statuscode: number;
    message: string;
    name: string;
    constructor(message: string) {
        this.statuscode = 403;
        this.message = message;
        this.name = "ForbiddenError";
    }
}

export class ConflictError implements AppError {
    statuscode: number;
    message: string;
    name: string;
    constructor(message: string) {
        this.statuscode = 409;
        this.message = message;
        this.name = "ConflictError";
    }
}

export class NotImplementedError implements AppError {
    statuscode: number;
    message: string;
    name: string;
    constructor(message: string) {
        this.statuscode = 501;
        this.message = message;
        this.name = "NotImplementedError";
    }
}

