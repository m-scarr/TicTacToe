import axios from "axios";
import io from 'socket.io-client';
import generateSocketActions from "./socket/index"
import { Socket } from "socket.io-client";
import { updateHighScores, updateUser } from "../store";

export default class API {
    static socketActions: any;

    static async init() {
        const socket: Socket = io(window.location.protocol+"//" + window.location.hostname, {
            withCredentials: true,
            transports: ["websocket"],
        });
        API.socketActions = generateSocketActions(socket);
        axios.defaults.baseURL = window.location.protocol+"//" + window.location.hostname;
        axios.defaults.withCredentials = true;
        await API.user.isLoggedIn();
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
                if (response.data.success) {
                    updateUser(response.data.user);
                }
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
                updateHighScores(result.data);
            } catch (err) {
                console.error(err);
                updateHighScores([]);
            }
        }
    }

    static update = {
    }

    static delete = {
    }
}
