import db from "../models/index.js";
import bcrypt from "bcrypt";
import limitAttributes from "./limitAttributes.js";
import { io } from "../server.js";

export default {
    unauthorized: {
        isLoggedIn: (req, res) => {
            res.json(
                req.isAuthenticated()
                    ? { success: true, user: { ...req.user } }
                    : { success: false }
            );
        },
        create: async (req, res) => {
            console.log(req.body)
            try {
                const salt = bcrypt.genSaltSync(10);
                const newUser = await db.User.create({
                    username: req.body.username,
                    displayName: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, salt),
                    salt: salt,
                    ...limitAttributes(req.body, ["displayName"])
                });
                res.json(newUser);
            } catch (err) {
                console.error(err);
                res.json(false);
                return;
            }
        },
        logIn: (req, res) => {
            res.json({
                success: true,
                user: { ...req.user },
            });
        },
    },
    authorized: {
        update: async (req, res) => {
            res.json()
        },
        logOut: (req, res) => {
            const socketId = req.session.socketId;
            if (socketId && io.of("/").sockets.get(socketId)) {
                io.of("/").sockets.get(socketId).disconnect(true); //disconnect socket if it isnt already
            }
            req.logout(function (err) {
                if (err) {
                    console.error(err);
                }
                res.cookie("connect.sid", "", { expires: new Date() }); //clear the cookie
                res.json(true);
            });
        },
    }
}