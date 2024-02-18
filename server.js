import express from "express";
import { createServer } from "http";
import { createClient } from "redis";
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

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "tictactoe:",
});

const app = express();
const server = createServer(app);
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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

const wrap = (middleware) => { //close to socket.io
    return (socket, next) => {
        middleware(socket.request, {}, next);
    }
}

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    next((socket.request.user) ? undefined : new Error('Attempted unauthorized socket use.'));
});

export const userSocketMap = {};    //THIS NEEDS TO BE STORED ON THE REDIS
export let socketActions = {};

io.on('connect', (socket) => {
    socketActions = socketHandlers(socket);
    if (socket.request.user.id.toString() in userSocketMap) {
        userSocketMap[socket.request.user.id.toString()].sockets.push(socket);
    } else {
        userSocketMap[socket.request.user.id.toString()] = {
            sockets: [socket],
            emit: (name, data) => {
                userSocketMap[socket.request.user.id.toString()].sockets.forEach((_socket) => {
                    _socket.emit(name, data);
                });
            }
        };
    }
    socket.on('disconnect', () => {
        const deleteIndex = userSocketMap[socket.request.user.id.toString()].sockets.indexOf(socket);
        if (deleteIndex !== -1) {
            userSocketMap[socket.request.user.id.toString()].sockets.splice(deleteIndex, 1);
        }
        Object.keys(socket.rooms).forEach((room) => {
            socket.leave(room);
        });
    });
});


server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});
