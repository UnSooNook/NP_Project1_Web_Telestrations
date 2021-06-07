import { handleNewUser, handleDisconnected } from "./login";
import { handleChat } from "./chat";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint";
import {
    handlePlayerUpdate,
    handleGameStarted,
    handleLeaderNotif,
    handleGameEnded,
    handleGameStarting,
} from "./players";

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
    aSocket.on(events.disconnected, handleDisconnected);
    // 채팅 이벤트
    aSocket.on(events.receiveChat, handleChat);
    // 그리기 시작 이벤트
    socket.on(events.beganPath, handleBeganPath);
    // 그리기 이벤트
    socket.on(events.strokedPath, handleStrokedPath);
    // 채우기 이벤트
    socket.on(events.filled, handleFilled);
    // 플레이어 업데이트 이벤트
    socket.on(events.playerUpdate, handlePlayerUpdate);
    // 게임 시작 이벤트
    socket.on(events.gameStarted, handleGameStarted);
    // 방장 이벤트
    socket.on(events.leaderNotif, handleLeaderNotif);
    // 게임 종료 이벤트
    socket.on(events.gameEnded, handleGameEnded);
    // 게임 시작 공지
    socket.on(events.gameStarting, handleGameStarting);
};
