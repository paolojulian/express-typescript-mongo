import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from 'passport';
import Token, { TokenInterface } from "./token";
import { HTTP401Error } from "../../utils/httpErrors";
import passportConfig from "../../config/passport";
import User, { UserInterface } from "../user/user";

passportConfig(passport);

export interface AccessTokenInterface {
    username: string
}

class AuthController {

    /**
     * @desc Login function
     * req.body
     *  - username
     *  - password
     */
    async login(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;

        if (req.cookies.refreshToken) {
            // Pass in the access token if there is an existing refreshToken already
            const token = await Token.findOne({ token: req.cookies.refreshToken }).exec();
            if (token) {
                const refreshToken = token.token;
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: AccessTokenInterface) => {
                    if (err) {
                        throw new Error(err);
                    }

                    const accessToken = AuthController.generateAccessToken(user);
                    res.status(200).json({ accessToken });
                });
                return;
            }
        }

        try {
            const user = await User.findByUsername(username);
            const doesMatch = await bcrypt.compare(password, user.password);
            if (!doesMatch) {
                next(new HTTP401Error);
                return;
            }

            const payload: AccessTokenInterface = {
                username: user.username
            }

            const accessToken = AuthController.generateAccessToken(payload);
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

            // TODO add token to database
            const refreshTokenData =  await Token.create({
                token: refreshToken
            });
            
            res.cookie('refreshToken', refreshToken);
            res.json({ accessToken });
        } catch (e) {
            next(e);
        }
    }

    /**
     * @desc Gets the current user logged in
     */
    current(req: Request, res: Response, next: NextFunction) {
        res
            .status(200)
            .json(req.user);
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401);
        }

        try {
            const token = await Token.findOne({ token: refreshToken }).exec();
            if (!token) {
                throw new Error("Invalid token.");
            }
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: AccessTokenInterface) => {
                if (err) {
                    throw new Error(err);
                }

                const accessToken = AuthController.generateAccessToken(user);
                res.status(200).json({ accessToken });
            });
        } catch (e) {
            return res.status(403);
        }
    }

    static generateAccessToken(payload: AccessTokenInterface): string {
        const exp = Math.floor(Date.now() / 1000) + (15 * 60); // 15 minutes
        return jwt.sign({ exp, payload }, process.env.ACCESS_TOKEN_SECRET);
    }

    authenticateJwt(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", (err: any, user: UserInterface|null, info) => {
            if (err) {
                return next(new HTTP401Error(err));
            }

            if (!user) {
                return next(new HTTP401Error());
            }

            req.user = {
                username: user.username
            };
            next();
        })(req, res, next);
    }


    authorizeJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", function (err, user, jwtToken) {
            if (err) {
                return next(new HTTP401Error(err));
            }

            if (!user) {
                return next(new HTTP401Error());
            }

            const scope = req.baseUrl.split("/").slice(-1)[0];
            const authScope = jwtToken.scope;
            if (authScope && authScope.indexOf(scope) > -1) {
                return next();
            }

            throw new HTTP401Error();
        })(req, res, next);
    }
}

export default AuthController;