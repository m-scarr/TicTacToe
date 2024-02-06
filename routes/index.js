import express from "express";
import authorizedRoutes from "./authorized/index.js";
import unauthorizedRoutes from "./unauthorized/index.js";

const router = express.Router();

router.use(
    "/auth",
    (req, res, next) => {
        req.isAuthenticated() ? next() : res.redirect("/");
    },
    authorizedRoutes
);
router.use("/", unauthorizedRoutes);

export default router;