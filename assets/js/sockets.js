import { handleNewUser, handleDisconnected } from "./notifications";

let socket = null;

// 소캣 불러오기
export const getSocket = () => {
    return socket;
};

// 소캣 저장
export const updateSocket = (aSocket) => {
    socket = aSocket;
};

// 소캣 초기 설정
export const initSockets = (aSocket) => {
    const { events } = window;
    updateSocket(aSocket);
    // 새 유저 로그인 이벤트
    aSocket.on(events.newUser, handleNewUser);
    // 유저 로그아웃 이벤트
    aSocket.on(events.disconnected, handleDisconnected);
};