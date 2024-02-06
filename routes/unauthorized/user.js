import express from "express";
import passport from "passport";
import userController from "../../controllers/user.js";
const router = express.Router();

router.post(
    "/create",
    await userController.unauthorized.create
);
router.get(
    "/isLoggedIn",
    userController.unauthorized.isLoggedIn
);
router.post(
    "/logIn",
    passport.authenticate("local", { failureMessage: true }),
    userController.unauthorized.logIn
);

export default router;