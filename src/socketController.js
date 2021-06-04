import events from "./events.js";

// 소켓 이벤트 처리
const socketController = (socket) => {
    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
    });
};

export default socketController;