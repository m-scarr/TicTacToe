import express from "express";
import authorizedRoutes from "./authorized/index.js";
import unauthorizedRoutes from "./unauthorized/index.js";

const router = express.Router();

router.use(
    "/auth",
    (req, res, next) => {
        console.log(req.isAuthenticated());
        req.isAuthenticated() ? next() : res.json("Not Authenticated");
    },
    authorizedRoutes
);
router.use("/", unauthorizedRoutes);

export default router;