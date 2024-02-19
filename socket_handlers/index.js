export default (socket) => {
    socket.on("exampleAction", (string) => {
        socket.emit("exampleActionResponse", `You said "${string}" to the server and the server and the server just wanted to say hi back.`)
    })
}