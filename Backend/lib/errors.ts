export class HttpError extends Error {
    status: number;
    details?: unknown;
    constructor(message: string, status: number = 400, details?: unknown){
        super(message);
        this.status = status;
        this.details = details;
        this.name = "HttpError";
    }
}