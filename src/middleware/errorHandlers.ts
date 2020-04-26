// tslint:disable:no-console
import { Request, Response, NextFunction, Application } from "express";
import { HTTPClientError, HTTP404Error, HTTP400Error } from "../utils/httpErrors";

const handle404Error = (app: Application) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        throw new HTTP404Error("Not found.");
    });
};

const handleClientError = (app: Application) => {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.warn(err);
        if (err instanceof HTTPClientError) {
            return res.status(err.statusCode).json(err.message);
        }

        if (err.name === "ValidationError") {
            res.status(400).json(err)

            return;
        }

        next(err);
    });
};

const handleServerError = (app: Application) => {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log('HandleServerError');
        console.error(err);
        if (process.env.NODE_ENV === "production") {
            res.status(500).send("Internal Server Error");
        } else {
            res.status(500).json(err.stack);
        }
    });
};

export default [
    handle404Error,
    handleClientError,
    handleServerError
];