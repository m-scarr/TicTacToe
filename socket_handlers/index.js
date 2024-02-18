//import messageSocketHandlers from "./message.js";

export default (socket) => {
    //const message = messageSocketHandlers(socket);
    socket.on("exampleAction",(string)=>{
        console.log("!!!!!!!!!!!!!!!!!!!!!!!")
        socket.emit("exampleActionResponse", `You said "${string}" to the server and the server and the server just wanted to say hi back.`)
    })
    const actions = {
        //...message
    }

    return actions;
}