import axios from "axios";
import io from 'socket.io-client';
import generateSocketActions from "./socket/index"
import { Socket } from "socket.io-client";
import { userStore } from "../store";

export default class API {
    static socketActions: any;

    static async init() {
        const socket: Socket = io('http://localhost:3000', {
            withCredentials: true,
            transports: ["websocket"],
        });
        API.socketActions = generateSocketActions(socket);
        axios.defaults.baseURL = "http://localhost:3000";
        axios.defaults.withCredentials = true;
        const result = await API.user.isLoggedIn();
        if (result.data.success) {
            userStore.set(result.data.user);
        }
    }

    static user = {
        create: async (username: string, password: string, email: string) => {
            const response = await axios.post("/user/create", { username, password, email });
            return response;
        },
        isLoggedIn: async () => {
            const response = await axios.get("/user/isLoggedIn")
            console.log(response);
            return response;
        },
        logIn: async (username: string, password: string) => {
            await axios.post("/user/logIn", { username, password });
            window.location.href = "/";
        },
        update: async (_data: any) => { },
        logOut: async () => {
            const res = await axios.delete("/auth/user/logOut");
            console.log(res)
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