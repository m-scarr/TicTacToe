import express from "express";
import { createServer } from "http";
import session from "express-session";
import bodyParser from "body-parser";
import path, { dirname } from "path"
import { fileURLToPath } from 'url';
import routes from "./routes/index.js"
import passport from "passport";
import passportConfig, { sessionSecret } from "./config/passport.js";
import db from "./models/index.js";
import { Server } from 'socket.io';
import socketHandlers from './socket_handlers/index.js';

const app = express();
const server = createServer(app);
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));
const sessionMiddleware = session({ secret: sessionSecret, resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//test
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

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    next((socket.request.user) ? undefined : new Error('Attempted unauthorized socket use.'));
});

export const sockets = {};

io.on('connect', (socket) => {
    const socketActions = socketHandlers(socket);
    socket.request.session.socketId = socket.id;
    socket.request.session.save();
    if (socket.request.user.id.toString() in sockets) {
        sockets[socket.request.user.id.toString()].push(socket);
    } else {
        sockets[socket.request.user.id.toString()] = [socket];
        sockets[socket.request.user.id.toString()].emit = (name, data) => {
            sockets[socket.request.user.id.toString()].forEach((_socket) => {
                _socket.emit(name, data);
            });
        }
    }
    socket.on('disconnect', () => {
        const deleteIndex = sockets[socket.request.user.id.toString()].indexOf(socket);
        if (deleteIndex !== -1) {
            sockets[socket.request.user.id.toString()].splice(deleteIndex, 1);
        }
    });
});


server.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});
