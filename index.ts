import express from 'express';
import http from 'http';
import usersRoute  from './src/routes/users';
import roomsRoute  from './src/routes/rooms';
import messagesRoute  from './src/routes/messages';
import { Server, Socket } from "socket.io"
import { getAllMessages, registerMessage } from './src/controllers/messagesController';
import { registerMember } from './src/controllers/roomsController';
import { Message } from './src/model/Message';
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
app.use("/messages", messagesRoute);


io.on("connection", (socket: Socket) => {

    socket.on("message", (message) => {
        console.log(`message: ${message}`);
        socket.emit('message', message + ":テスト");
    });

    socket.on("join", (id:string) => {
        
        socket.join(id.toString());
        console.log(`User joined room: ${id}`);
        io.to(id.toString()).emit("chat","eeee")
    });

    socket.on("sendMessage", async(data:any) => {
        const { id, employeeCode, employeeName, text} = data;
        try {
            const message = new Message(id, employeeCode, employeeName, text)
            const res = await registerMessage(message);
            io.to(id.toString()).emit("chat",message);
            io.to(id.toString())
        } catch(e) {
            console.log(e);
        }
        
    })

    socket.on("leave", (id:string) => {
        socket.leave(id.toString());
        console.log(`User left room: ${id}`);
    })

    socket.on("disconnect", () => {
        console.log("disconnected");
        socket.disconnect();
    });


})

// server.listen(WS_PORT, () => {
//     console.log(`ws server is running on port ${WS_PORT}`)
// });