import events from "./events.js";

// 소켓 이벤트 처리
const socketController = (socket) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);

    // 닉네임 설정(나)
    socket.on(events.setNickname, ({ nickname }) => {
        // 닉네임 설정
        socket.nickname = nickname;
        // 로그인 알리기
        socket.emit(events.newUser, { nickname });
        broadcast(events.newUser, { nickname });
    });

    // 로그아웃(나)
    socket.on(events.disconnect, () => {
        // 로그아웃 알리기
        broadcast(events.disconnected, { nickname: socket.nickname });
    });

    // 채팅
    socket.on(events.sendChat, ({ chats }) => {
        socket.emit(events.receiveChat, { nickname: socket.nickname, chats });
        broadcast(events.receiveChat, { nickname: socket.nickname, chats });
    });
};

export default socketController;
