import { body } from "express-validator";

const ValidationRules = {
    login: () => {
        return [
            // Username
            body("username").notEmpty(),

            // Password
            body("password").notEmpty()
        ];
    }
}

export {
    ValidationRules
}