import express from 'express';
import http from 'http';
import usersRoute  from './src/routes/users';
import roomsRoute  from './src/routes/rooms';
import { Server, Socket } from "socket.io"
// const prisma = new PrismaClient();

const app: express.Express = express();
const server = http.createServer(app);

const WS_PORT = 8080;
const io = new Server(WS_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log("start")
});

app.use("/users", usersRoute);
app.use("/rooms", roomsRoute);


io.on("connection", (socket: Socket) => {
    


    socket.on("message", (message) => {
        console.log(`message: ${message}`);
        io.emit('message', message);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
        socket.disconnect();
    });


})

// server.listen(WS_PORT, () => {
//     console.log(`ws server is running on port ${WS_PORT}`)
// });