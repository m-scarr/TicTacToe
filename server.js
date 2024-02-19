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

const redisClient = createClient();
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

export let socketActions = {};

io.on('connect', (socket) => {
    //this disallows players from logging into their profile from multiple devices or browsers.
    io.sockets.sockets.forEach((_socket) => {
        if (socket !== _socket && socket.request.user.id === _socket.request.user.id) {
            socket.emit("alreadyLoggedIn", null);
            socket.request.logout(function (err) {
                if (err) {
                    console.error(err);
                }
                socket.disconnect(true);
            });
        }
    });

    socketActions = socketHandlers(socket);
    
    socket.on('disconnect', () => {
        Object.keys(socket.rooms).forEach((room) => {
            socket.leave(room);
        });
    });
});


server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});
