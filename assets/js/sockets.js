import { handleNewUser, handleDisconnected } from "./notifications";
import { handleNewMessage } from "./chat";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint";
import { handlePlayerUpdate } from "./players";

let socket = null;

// 소캣 불러오기
export const getSocket = () => {
    return socket;
};

// 소캣 초기 설정
export const initSockets = (aSocket) => {
    const { events } = window;
    socket = aSocket;
    // 새 유저 로그인 이벤트
    socket.on(events.newUser, handleNewUser);
    // 유저 로그아웃 이벤트
    socket.on(events.disconnected, handleDisconnected);
    // 새 채팅 이벤트
    socket.on(events.newMsg, handleNewMessage);
    // 그리기 시작 이벤트
    socket.on(events.beganPath, handleBeganPath);
    // 그리기 이벤트
    socket.on(events.strokedPath, handleStrokedPath);
    // 채우기 이벤트
    socket.on(events.filled, handleFilled);
    // 
    socket.on(events.playerUpdate, handlePlayerUpdate);
};