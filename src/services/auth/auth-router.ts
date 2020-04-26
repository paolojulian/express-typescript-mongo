import { Router } from "express";
import { ValidationRules } from "./auth-validations";
import validate from "../../utils/validation";
import AuthController from "./auth-controller";

class AuthRouter {
    private authController: AuthController = new AuthController();

    routes(): Router {
        return Router()
            // Public routes
            .post(
                "/login",
                ValidationRules.login(),
                validate,
                this.authController.login
            )
            // Private routes
            .get(
                "/current",
                this.authController.authenticateJwt,
                this.authController.current
            )
            .post(
                "/refresh-token",
                this.authController.refreshToken
            )
    }
}

export default AuthRouter