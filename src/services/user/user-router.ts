import { Router } from "express";
import { ValidationRules } from "./user-validations";
import validate from "../../utils/validation";
import UserController from "./user-contoller";

class UserRouter {
    private userController: UserController = new UserController();

    routes(): Router {
        return Router()
            // Public routes
            .post(
                "/register",
                ValidationRules.register(),
                validate,
                this.userController.register.bind(this.userController)
            )
    }
}

export default UserRouter