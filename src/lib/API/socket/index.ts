import { Socket } from "socket.io-client";
import { userStore } from "../../store";
//import messageSocketHandlers from "./message.js";

export default (socket: Socket) => {
    //const message = messageSocketHandlers(socket);
    socket.on("exampleActionResponse", (res: any) => {
        alert(res);
    });

    socket.on("alreadyLoggedIn", () => {
        userStore.set(null);
        alert("This user is already logged in!");
        window.location.href = "/";
    });

    const actions = {
        //...message
        testAction: () => {
            socket.emit("exampleAction", "Hello!");
        }
    }

    return actions;
}