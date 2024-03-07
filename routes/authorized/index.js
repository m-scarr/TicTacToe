import express from "express";
import user from "./user.js";
import score from "./score.js";

const router = express.Router();

router.use("/user", user);
router.use("/score", score);

export default router;