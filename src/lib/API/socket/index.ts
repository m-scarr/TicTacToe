import { Socket } from "socket.io-client";
//import messageSocketHandlers from "./message.js";

export default (socket: Socket) => {
    //const message = messageSocketHandlers(socket);
    socket.on("exampleActionResponse", (res: any) => {
        alert(res);
    })
    const actions = {
        //...message
        testAction: () => {
            socket.emit("exampleAction", "Hello!");
        }
    }

    return actions;
}