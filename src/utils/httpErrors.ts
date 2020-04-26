// tslint:disable-next-line:max-classes-per-file
export abstract class HTTPClientError extends Error {
    readonly statusCode!: number;
    readonly name!: string;

    constructor(message: object | string) {
        if (message instanceof Object) {
            super(JSON.stringify(message));
        } else {
            super(message);
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation errors
 * @example throw new HTTP400Error({ password: "Password is too short"})
 */
// tslint:disable-next-line:max-classes-per-file
export class HTTP400Error extends HTTPClientError {
    readonly statusCode = 400;

    constructor(message: string | object = "Bad Request") {
        super(message);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class HTTP401Error extends HTTPClientError {
    readonly statusCode = 401;

    constructor(message: string | object = "Unauthorized") {
        super(message);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class HTTP403Error extends HTTPClientError {
    readonly statusCode = 403;

    constructor(message: string | object = "Forbidden") {
        super(message);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class HTTP404Error extends HTTPClientError {
    readonly statusCode = 404;

    constructor(message: string | object = "Not found") {
        super(message);
    }
}