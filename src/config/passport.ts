import { PassportStatic } from "passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import User, { UserInterface } from '../services/user/user';
import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve(__dirname, '../../.env') });

const secretOrKey = process.env.ACCESS_TOKEN_SECRET;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey
}

export default (passport: PassportStatic) => {
    passport.use(new Strategy(opts, (token, done) => {
        User.findOne({ username: token.payload.username }, (err: any, user: UserInterface) => {
            if (err) {
                done(err, null);
            }
            if (!user) {
                return done(null, null);
            }

            done(null, user, token);
        })
    }));
}