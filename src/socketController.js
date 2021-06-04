import events from "./events.js";
import { io } from "./server.js";

// 소켓 이벤트 처리
const socketController = (socket) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    // 닉네임 설정(나)
    socket.on(events.setNickname, ({ nickname }) => {
        // 닉네임 설정
        socket.nickname = nickname;
        // 로그인 알리기
        broadcast(events.newUser, { nickname });
    });
    // 로그아웃(나)
    socket.on(events.disconnect, () => {
        // 로그아웃 알리기
        broadcast(events.disconnected, { nickname: socket.nickname });
    });
};

export default socketController;