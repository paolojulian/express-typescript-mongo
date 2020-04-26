import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "./user";

export interface AccessTokenInterface {
    name: string
}

class UserController {

    /**
     * Registration
     */
    async register(req: Request, res: Response, next: NextFunction) {
        const { email, username, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const user = await User.create({
            email,
            username,
            password: hashedPassword
        });
        delete user.password;
        res.status(201).send({ user });
    }
}

export default UserController;