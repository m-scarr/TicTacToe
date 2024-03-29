import express from "express";
import { createServer } from "http";
import redisAdapter from 'socket.io-redis';
import RedisStore from "connect-redis"
import session from "express-session";
import redis from 'redis';

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
import scoreController from "./controllers/score.js";

export const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

await redisClient.connect();

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "tictactoe:",
});

const subClient = redisClient.duplicate();
await subClient.connect();

const app = express();
const server = createServer(app);
const port = 3000;

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
const sessionMiddleware = session({
    store: redisStore,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 10 // session max age in miliseconds
    }
});
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'dist')));
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

export const findSocketByUser = async (id) => {
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

io.on('connect', async (socket) => {

    const sameUserOtherSocket = await findSocketByUser(socket.request.user.id);
    if (typeof sameUserOtherSocket !== "undefined" && sameUserOtherSocket !== null) {
        sameUserOtherSocket.emit("newLogIn", null);

        const game = await Game.get(socket.request.user.id);
        if (game !== null) {
            scoreController.endStreak(socket.request.user.id);
            const otherSocket = await findSocketByUser(game.players.X.id === socket.request.user.id ? game.players.O.id : game.players.X.id);
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

    socketHandlers(socket);

    socket.on('disconnect', async () => {
        if (socket.request.user !== null) {
            await redisClient.del(`/users/socket/${socket.request.user.id.toString()}`);
            const game = await Game.get(socket.request.user.id);
            if (game !== null) {
                scoreController.endStreak(socket.request.user.id);
                const otherSocket = await findSocketByUser(game.players.X.id === socket.request.user.id ? game.players.O.id : game.players.X.id);
                if (otherSocket !== null) {
                    otherSocket.emit("error", "Your opponent left.");
                }
                await game.delete();
            }
        }
    });
});


server.listen(port, () => {
    console.log(`application is running port ${port}`);
});
