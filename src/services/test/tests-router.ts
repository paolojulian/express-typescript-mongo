import { Router, Request, Response, NextFunction } from "express";
// import passport from 'passport';
import Test from "./test";

class TestRouter {
    routes (): Router {
        return Router()
            // Public routes
            .get("/", this.all)
            .post("/", this.add)
            // Private routes
            // .post("/auth", passport.authenticate('jwt', { session: false }), this.testAuth)
    }

    /**
     * @desc Get list of test
     * @access Public
     */
    private async all (req: Request, res: Response, next: NextFunction) {
        try {
            const tests = await Test.find({}).exec();
            res.json(tests);
        } catch (e) {
            next(e);
        }
    }

    /**
     * @desc Add a test
     * @access Public
     */
    private async add (req: Request, res: Response, next: NextFunction) {
        try {
            const test = await Test.create({
                name: req.body.name,
                job: req.body.job
            });
            res.status(201).json(test);
        } catch (e) {
            next(e);
        }
    }

    /**
     * @desc Test the authentication
     * @access Private
     */
    private async testAuth (req: Request, res: Response, next: NextFunction) {
        return res.json({
            user: req.user
        });
    }
}

export default TestRouter