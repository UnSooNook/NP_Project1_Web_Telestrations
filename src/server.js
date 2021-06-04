import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import { Server, Socket } from "socket.io";
import logger from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => res.render("home"));

const handleListening = () =>
    console.log(`✅ Server running: http://localhost:${PORT}`);
const server = app.listen(PORT, handleListening);
const io = new Server(server);


let sockets = [];
// 소캣 연결 이벤트 처리
io.on("connection", socket => {
    // sockets.push(socket.id);
    // 이벤트 받기
    socket.on("newMessage", ({ message }) => {
        socket.broadcast.emit("messageNotif", {
            message,
            nickname: socket.nickname || "Anon"
        });
    });
    socket.on("setNickname", ({ nickname }) => {
        socket.nickname = nickname;
    });
    // 이벤트 보내기
    // setTimeout(() => socket.emit("helloGuys"), 4000);
});

// setInterval(() => console.log(sockets), 1000)