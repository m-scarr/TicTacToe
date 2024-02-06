import express from "express";
import userController from "../../controllers/user.js";
const router = express.Router();

router.put("/update", await userController.authorized.update);
router.delete("/logOut", userController.authorized.logOut);

export default router;