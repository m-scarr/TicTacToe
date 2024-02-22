import express from "express";
import { createServer } from "http";
import { createClient } from "redis";
import redisAdapter from 'socket.io-redis';
import RedisStore from "connect-redis"
import session from "express-session";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import routes from "./routes/index.js";
import passport from "passport";
import passportConfig, { sessionSecret } from "./config/passport.js";
import db from "./models/index.js";
import { Server } from 'socket.io';
import socketHandlers from './socket_handlers/index.js';
import { Game } from "./socket_handlers/game.js";

export const redisClient = createClient({ host: "localhost:3536" });
await redisClient.connect();
const subClient = redisClient.duplicate();
await subClient.connect();
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "tictactoe:",
});

const app = express();
const server = createServer(app);
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'dist')));
const sessionMiddleware = session({ store: redisStore, secret: sessionSecret, resave: false, saveUninitialized: false, cookie: { secure: false }, });
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

passportConfig(db);

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use(routes);

export const io = new Server(server);

const wrap = (middleware) => {
    return (socket, next) => {
        middleware(socket.request, {}, next);
    }
}

io.adapter(redisAdapter(redisClient, subClient));
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    next((socket.request.user) ? undefined : new Error('Attempted unauthorized socket use.'));
});

export let findSocketByUser = () => { };

io.on('connect', async (socket) => {

    const sameUserOtherSocket = await findSocketByUser(socket.request.user.id);
    if (typeof sameUserOtherSocket !== "undefined" && sameUserOtherSocket !== null) {
        sameUserOtherSocket.emit("newLogIn", null);

        const game = await Game.get(socket.request.user.id);
        if (game !== null) {
            const otherSocket = await findSocketByUser(game.players.X === sameUserOtherSocket.request.user.id ? game.players.O : game.players.X);
            //socket.request.user loses streak
            if (typeof otherSocket !== "undefined" && otherSocket !== null) {
                otherSocket.emit("error", "Your opponent left.");
            }
            await game.delete();
        }

        sameUserOtherSocket.request.logout(async function (err) {
            if (err) {
                console.error(err);
            }
            sameUserOtherSocket.disconnect(true);
        })
    }

    await redisClient.set(`/users/socket/${socket.request.user.id.toString()}`, socket.id);

    findSocketByUser = async (id) => {
        const userSocketId = await redisClient.get(`/users/socket/${id.toString()}`);
        if (userSocketId !== null) {
            const userSocket = io.of("/").sockets.get(userSocketId);
            if (userSocket) {
                return userSocket;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    socketHandlers(socket);

    socket.on('disconnect', async () => {
        if (socket.request.user !== null) {
            await redisClient.del(`/users/socket/${socket.request.user.id.toString()}`);
            const game = await Game.get(socket.request.user.id);
            if (game !== null) {
                const otherSocket = await findSocketByUser(game.players.X === socket.request.user.id ? game.players.O : game.players.X);
                if (otherSocket !== null) {
                    otherSocket.emit("error", "Your opponent left.");
                }
                await game.delete();
            }
        }
    });
});


server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});
