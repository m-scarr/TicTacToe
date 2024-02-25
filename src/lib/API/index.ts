import axios from "axios";
import io from 'socket.io-client';
import generateSocketActions from "./socket/index"
import { Socket } from "socket.io-client";
import { updateUser } from "../store";

export default class API {
    static socketActions: any;

    static async init() {
        const socket: Socket = io('http://' + window.location.hostname + ':3000', {
            withCredentials: true,
            transports: ["websocket"],
        });
        API.socketActions = generateSocketActions(socket);
        axios.defaults.baseURL = "http://" + window.location.hostname + ":3000";
        axios.defaults.withCredentials = true;
        const result = await API.user.isLoggedIn();
        if (result.success) {
            updateUser(result.user);
        }
    }

    static user = {
        create: async (username: string, password: string, email: string) => {
            try {
                const response = await axios.post("/user/create", { username, password, email });
                if (response.data !== false) {
                    return true;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        },
        isLoggedIn: async () => {
            try {
                const response = await axios.get("/user/isLoggedIn");
                return response.data;
            } catch (err) {
                console.error(err);
                return { success: false }
            }
        },
        logIn: async (username: string, password: string) => {
            try {
                await axios.post("/user/logIn", { username, password });
                window.location.href = "/";
            } catch (err) {
                alert("Log in failed!");
            }
        },
        update: async (_data: any) => { },
        logOut: async () => {
            try {
                await axios.delete("/auth/user/logOut");
                window.location.href = "/";
            } catch (err) {
                console.error(err);
            }
        },
    }

    static create = {
    }

    static read = {
        highScores: async () => {
            try {
                const result = await axios.get("/auth/score/readHighScores");
                return result.data;
            } catch (err) {
                return [];
            }
        }
    }

    static update = {
    }

    static delete = {
    }
}
