import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import { Server, Socket } from "socket.io";
import logger from "morgan";

import socketController from "./socketController.js";
import events from "./events.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => {
    res.render("home", { events: JSON.stringify(events) });
});

const handleListening = () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
};

// 서버, 소켓 서버 시작
const server = app.listen(PORT, handleListening);
const io = new Server(server);

// 소캣 연결 이벤트 처리
io.on("connection", socket => socketController(socket));