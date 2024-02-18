import { Socket } from "socket.io-client";
//import messageSocketHandlers from "./message.js";

export default (socket: Socket) => {
    //const message = messageSocketHandlers(socket);

    const actions = {
        //...message
        testAction: () => {
            socket.emit("testAction", "Hello!");
        }
    }

    return actions;
}