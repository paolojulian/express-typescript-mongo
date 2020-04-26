import { body, Meta } from "express-validator";
import User from "./user";

const uniqueUsername = async (value: string) => {
    try {
        const user = await User.findByUsername(value);
        if (user) {
            throw Error('Username already exists.');
        }
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};

const uniqueEmail = async (value: string) => {
    try {
        const user = await User.findByEmail(value);
        if (user) {
            throw Error('Email already exists.');
        }
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};

const passwordConfirmation = (confirmPassword: string, { req }: Meta) => {
    if (confirmPassword !== req.body.password) {
        return Promise.reject("Password confirmation does not match password");
    }

    return Promise.resolve();
}

const ValidationRules = {
    register: () => {
        return [
            // Email
            body("email")
                .isEmail()
                .withMessage('must be an email.')
                .custom(uniqueEmail)
                .trim(),
                
            // Username
            body("username")
                .notEmpty()
                .withMessage('Username is required.')
                .custom(uniqueUsername)
                .trim(),

            // Password
            body("password")
                .notEmpty()
                .withMessage('Password is required.')
                .isLength({ min: 6, max: 20 })
                .withMessage('must be 6 to 20 characters only.'),
            
            // Confirm Password
            body("confirmPassword")
                .custom(passwordConfirmation)
        ];
    }
}

export {
    ValidationRules
}