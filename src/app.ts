// tslint:disable:no-console
import express, { Application, Request, Response } from "express";
import { resolve } from "path";
import { config } from "dotenv";
import database, { connect } from './config/database';
import { applyMiddleware } from "./utils";
import middlewares from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
// Routes
import TestRouter from "./services/test/tests-router";
import AuthRouter from "./services/auth/auth-router";
import UserRouter from "./services/user/user-router";
config({ path: resolve(__dirname, '../.env') });

class Server {
    public app: Application;
    private port: number;
    private db: string;

    constructor() {
        this.app = express();
        this.port = 8081 || Number(process.env.PORT);
        if (process.env.NODE_ENV === "test") {
            this.port = 9081;
        }
        this.db = process.env.DB;

        this.middlewares()
            .routes()
            .errorHandlers()
            .mongo();
    }

    private middlewares(): this {
        applyMiddleware(middlewares, this.app);
        return this;
    }

    private routes(): this {
        this.app.use("/api/auth", (new AuthRouter).routes());
        this.app.use("/api/tests", (new TestRouter).routes());
        this.app.use("/api/users", (new UserRouter).routes());
        return this;
    }

    private errorHandlers(): this {
        applyMiddleware(errorHandlers, this.app);
        return this;
    }

    private mongo(): this {
        database();
        connect(this.db)
            .then(() => {
            })
            .catch(err => {
                console.log(err);
            });
        return this;
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Port listening on ${this.port}`);
        });
    }
}

const server = new Server();
server.start();

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});

export default server.app;