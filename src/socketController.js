import events from "./events.js";

// 플레이어 관리
let sockets = [];
// 게임 스케치북 관리
let sketchBook = {};
// 방장
let leader = null;
// 게임 진행 중 여부
let inPlaying = false;
// 게임 턴
let gameTurn = -1;
// 준비 카운트
let readyCount = 0;

// 소켓 이벤트 처리
const socketController = (socket, io) => {
    // 나를 제외하고 broadcast
    const broadcast = (event, data) => {
        socket.broadcast.emit(event, data);
    };
    // 나를 포함한 모두에게 알림
    const superBroadcast = (event, data) => {
        io.emit(event, data);
    };
    // 특정 플레이어에게 알림
    const sendTo = (id, event, data) => {
        io.to(socket.id).emit(event, data);
    };
    // 플레이어 정보 업데이트 알림
    const updatePlayer = () => {
        superBroadcast(events.updatePlayer, { sockets });
    };
    // 방장이 변경될 때 클라이언트 소캣에게 알림
    const changeLeader = (leaderSocketID) => {
        leader = leaderSocketID;
        // 클라이언트에 알림
        if (leader) {
            sendTo(leader, events.leaderNotif, {});
            console.log(`Change Leader - id: ${leader}`);
        }
    };
    // 게임 시작
    const gameStart = () => {
        // TODO: 게임 시작 알리기, 초기화, 단어 설정
        console.log("Game Start!");
    };
    // 게임 종료
    const terminateGame = () => {
        // TODO
        console.log("Game Terminated!");
    };

    // 클라이언트가 접속할 때 관리 및 알림
    socket.on(events.logIn, ({ nickname }) => {
        console.log(`logIn - nickname: ${nickname}, id: ${socket.id}`);
        // 소켓 초기회
        socket.nickname = nickname;
        socket.ready = false;
        socket.leader = false;
        // sockets 반영
        sockets = sockets.filter(
            (aSocket) => aSocket.nickname !== socket.nickname
        );
        sockets.push({
            id: socket.id,
            nickname: nickname,
            leader: socket.leader,
            ready: socket.ready,
        });
        if (sockets.length === 1) changeLeader(socket.id);
        // 새 플레이어 알림
        superBroadcast(events.helloPlayer, { nickname });
        // 플레이어 정보 업데이트
        updatePlayer();
    });

    // 플레이어가 로그아웃 할 때 관리 및 알림
    socket.on(events.logOut, () => {
        console.log(`logOut - nickname: ${socket.nickname}, id: ${socket.id}`);
        // sockets에서 제거
        sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
        // 방장이었으면 방장 재설정
        if (leader) {
            if (socket.id === leader) {
                if (sockets.length >= 1) changeLeader(sockets[0].id);
                else changeLeader(null);
            }
        }
        // 게임중이었다면 게임 종료
        if (inPlaying) terminateGame();
        // 플레이어 나감 알림
        broadcast(events.byePlayer, { nickname: socket.nickname });
        // 플레이어 정보 업데이트
        updatePlayer();
    });

    // 채팅
    socket.on(events.sendMessage, ({ message }) => {
        superBroadcast(events.newMessage, {
            nickname: socket.nickname,
            message,
        });
        console.log(`Send Message - ${socket.nickname}: ${message}`);
    });

    // 방장이 변경될 때 서버의 방장 소캣에 반영
    socket.on(events.leaderConfirm, ({}) => {
        socket.leader = true;
        console.log(`Leader Confirm - ${socket.nickname}`);
    });

    // 플레이어가 레디 버튼을 눌렀을 때
    socket.on(events.lobbyReady, ({ ready }) => {
        // 방장이 시작 버튼을 눌렀을 때 준비가 됐으면 게임 시작
        if (socket.id === leader) {
            if (readyCount === sockets.length - 1) {
                ready = true;
                // TODO: 게임 시작
                gameStart();
                return;
            } else {
                ready = false;
                console.log(
                    `Lobby Ready - game start fail, count: ${readyCount}`
                );
            }
        } else {
            if (ready) {
                readyCount++;
            } else {
                readyCount--;
            }
        }
        // sockets에 상태 반영 후 알림
        socket.ready = ready;
        const me = sockets.find((aSocket) => {
            if (aSocket.id === socket.id) return true;
        });
        const myIndex = sockets.indexOf(me);
        sockets[myIndex].ready = ready;
        updatePlayer();
        console.log(
            `Lobby Ready - nickname: ${socket.nickname}, ready: ${socket.ready}, count: ${readyCount}`
        );
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
