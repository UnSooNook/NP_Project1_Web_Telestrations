import { handleHelloPlayer, handleByePlayer } from "./logIn";
import { handleNewMessage } from "./chat";
import { handleBeganPath, handleStrokedPath, handleFilled } from "./paint";
import { handleLeaderNotif, handleUpdatePlayer } from "./players";

let socket = null;

// 내 소켓 리턴
export const getMySocket = () => {
    return socket;
};

// 내 소켓 정보 업데이트
export const updateMySocket = (aSocket) => {
    socket.nickname = aSocket.nickname;
    socket.ready = aSocket.ready;
    socket.leader = aSocket.leader;
};

// 소캣 초기 설정
export const initMySocket = (aSocket) => {
    const { events } = window;
    socket = aSocket;
    // 이벤트 리스너 추가
    socket.on(events.updatePlayer, handleUpdatePlayer);
    socket.on(events.helloPlayer, handleHelloPlayer);
    socket.on(events.byePlayer, handleByePlayer);
    socket.on(events.leaderNotif, handleLeaderNotif);
    socket.on(events.newMessage, handleNewMessage);

    // 그리기 시작 이벤트
    socket.on(events.beganPath, handleBeganPath);
    // 그리기 이벤트
    socket.on(events.strokedPath, handleStrokedPath);
    // 채우기 이벤트
    socket.on(events.filled, handleFilled);
};
