import { Application, Router } from "express";

type Wrapper = ((app: Application) => void);

export const applyMiddleware = (
    middleware: Wrapper[],
    app: Application
) => {
    for (const f of middleware) {
        f(app);
    }
};