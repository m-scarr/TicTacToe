import express from "express";
import scoreController from "../../controllers/score.js";
const router = express.Router();

router.get("/readHighScores", await scoreController.authorized.readHighScores);

export default router;