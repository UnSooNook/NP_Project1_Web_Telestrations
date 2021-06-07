import events from "./events.js";

// 서버의 소캣 리스트
let sockets = [];
// 게임 중
let inPlaying = false;
// 방장
let leader = null;
// 게임 턴
let gameTurn = null;
// 게임 데이터
let sketchBook = {};

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
        inPlaying = true;
        gameTurn = 1;
        // TODO
    };
    // 게임 종료
    const endGame = () => {
        inPlaying = false;
        gameTurn = null;
        // TODO
    };

    // 방장 정하기
    const chooseLeader = () => {
        // TODO
    };

    // 로그인 (나)
    socket.on(events.login, ({ nickname }) => {
        // 기본 소켓 변수 설정
        socket.nickname = nickname;
        socket.ready = false;
        // 소캣 등록
        sockets.push({ id: socket.id, nickname: nickname });
        // 방장인지 확인
        if (sockets.length === 1) {
            socket.leader = true;
            leader = socket.id;
        } else {
            socket.leader = false;
        }
        // 로그인 알리기
        superBroadcast(events.newUser, { nickname });
        // 플레이어 업데이트 알림
        sendPlayerUpdate();
    });

    // 로그아웃(나)
    socket.on(events.disconnect, () => {
        // 소캣 등록 해제
        sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
        if (socket.leader) {
            // TODO : 새로운 방장 설정
        }
        // 로그아웃 알리기
        broadcast(events.disconnected, { nickname: socket.nickname });
        sendPlayerUpdate();
    });

    // 채팅
    socket.on(events.sendChat, ({ chats }) => {
        superBroadcast(events.receiveChat, {
            nickname: socket.nickname,
            chats,
        });
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
