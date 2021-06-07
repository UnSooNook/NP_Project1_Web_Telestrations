import events from "./events.js";

// 서버의 소캣 리스트
let sockets = [];
// 게임 중
let inProgress = false;
// 방장
let leader = null;
// 게임 타이머
let timeout = null;

// 소켓 이벤트 처리
const socketController = (socket, io) => {
    // Broadcast
    const broadcast = (event, data) => {
        socket.broadcast.emit(event, data);
    };
    // Super Broadcast
    const superBroadcast = (event, data) => {
        io.emit(event, data);
    };
    // 플레이어 업데이트
    const sendPlayerUpdate = () => {
        superBroadcast(events.playerUpdate, { sockets });
    };
    // 게임 시작
    const startGame = () => {
        // // 2명 이상이면 게임 시작
        // if (sockets.length > 1) {
        //     // 게임 중이 아니면 게임 시작
        //     if (inProgress === false) {
        //         inProgress = true;
        //         // 방장, 단어 고르기
        //         leader = chooseLeader();
        //         word = chooseWord();
        //         // 게임 시작 공지
        //         superBroadcast(events.gameStarting);
        //         // 2초 후 게임 시작
        //         setTimeout(() => {
        //             superBroadcast(events.gameStarted);
        //             // 방장에게 방장, 단어 알리기
        //             io.to(leader.id).emit(events.leaderNotif, { word });
        //             // 타이머 작동
        //             timeout = setTimeout(endGame, 30000);
        //         }, 5000);
        //     }
        // }
    };
    // 게임 종료
    const endGame = () => {
        // inProgress = false;
        // superBroadcast(events.gameEnded);
        // // 게임 타이머 재설정
        // if (timeout !== null) {
        //     clearTimeout(timeout);
        // }
        // setTimeout(() => startGame(), 2000);
    };

    // 닉네임 설정(나)
    socket.on(events.setNickname, ({ nickname }) => {
        // 닉네임 설정
        socket.nickname = nickname;
        // 소캣 등록
        sockets.push({ id: socket.id, nickname: nickname });
        // 로그인 알리기
        superBroadcast(events.newUser, { nickname });
        // 플레이어 업데이트 알림
        sendPlayerUpdate();
    });

    // 로그아웃(나)
    socket.on(events.disconnect, () => {
        // 소캣 등록 해제
        sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
        // 게임 종료
        // if (sockets.length === 1) {
        //     endGame();
        // } else if (leader) {
        //     if (leader.id === socket.id) {
        //         endGame();
        //     }
        // }
        // 로그아웃 알리기
        broadcast(events.disconnected, { nickname: socket.nickname });
        sendPlayerUpdate();
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

    // 채팅
    socket.on(events.sendChat, ({ chats }) => {
        superBroadcast(events.receiveChat, {
            nickname: socket.nickname,
            chats,
        });
    });
};

export default socketController;
