import axios from "axios";
import io from 'socket.io-client';
import generateSocketActions from "./socket/index"
import { Socket } from "socket.io-client";
import { userStore } from "../store";

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
        if (result.data.success) {
            userStore.set(result.data.user);
        }
    }

    static user = {
        create: async (username: string, password: string, email: string) => {
            try {
                const response = await axios.post("/user/create", { username, password, email });
                console.log(response)
                if (response.data !== false) {
                    return true
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        },
        isLoggedIn: async () => {
            const response = await axios.get("/user/isLoggedIn")
            console.log(response);
            return response;
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
            await axios.delete("/auth/user/logOut");
            window.location.href = "/";
        },
    }

    static create = {
    }

    static read = {
    }

    static update = {
    }

    static delete = {
    }
}
