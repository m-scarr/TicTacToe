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
            try {
                const salt = bcrypt.genSaltSync(10);
                await db.User.create({
                    username: req.body.username,
                    displayName: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, salt),
                    ...limitAttributes(req.body, ["displayName"])
                });
                res.json(true);
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
            if (socketId) {
                const socket = io.of("/").sockets.get(socketId);
                if (socket) {
                    socket.disconnect();
                }
            }
            req.logout(function (err) {
                if (err) {
                    console.error(err);
                }
                res.clearCookie("connect.sid");
                res.json(true);
            });
        },
    }
}
