import events from "./events.js";
import { setInterval } from "timers";

// 서버의 소캣 리스트
let sockets = [];

// 소켓 이벤트 처리
const socketController = (socket, io) => {
    
    const broadcast = (event, data) => {
        socket.broadcast.emit(event, data);
    };
    const superBroadcast = (event, data) => {
        io.emit(event, data);
    };
    const sendPlayerUpdate = () => {
        superBroadcast(events.playerUpdate, { sockets });
    };
    // 닉네임 설정(나)
    socket.on(events.setNickname, ({ nickname }) => {
        // 닉네임 설정
        socket.nickname = nickname;
        // 소캣 등록
        sockets.push({ id: socket.id, points: 0, nickname: nickname });
        // 로그인 알리기
        broadcast(events.newUser, { nickname });
        sendPlayerUpdate();
    });
    // 로그아웃(나)
    socket.on(events.disconnect, () => {
        // 소캣 등록 해제
        sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
        // 로그아웃 알리기
        broadcast(events.disconnected, { nickname: socket.nickname });
        sendPlayerUpdate();
    });
    // 메시지 보내기(나)
    socket.on(events.sendMsg, ({ message }) => {
        // 메시지 알리기
        broadcast(events.newMsg, { message, nickname: socket.nickname });
    });
    // 그리기 시작(나)
    socket.on(events.beginPath, ({ x, y }) => {
        // 그리기 시작 알리기
        broadcast(events.beganPath, { x, y });
    });
    // 그리기(나)
    socket.on(events.strokePath, ({ x, y, color }) => {
        // 그리기 시작 알리기
        broadcast(events.strokedPath, { x, y, color });
    });
    // 채우기(나)
    socket.on(events.fill, ({ color }) => {
        // 채우기 알리기
        broadcast(events.filled, { color });
    });
};

export default socketController;