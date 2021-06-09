import events from "./events.js";
import { chooseWords } from "./words.js";

// 플레이어 관리
let sockets = [];
// 게임 스케치북 관리
let sketchBook = [];
// 게임 단어 관리
let words = [];
// 방장
let leader = null;
// 게임 진행 중 여부
let inPlaying = false;
// 준비 카운트
let readyCount = 0;
// 게임 턴
let gameTurn = -1;
// 게임이 끝나는 턴
let finalTurn = -1;


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
        io.to(id).emit(event, data);
    };
    // 플레이어 정보 업데이트 알림
    const updatePlayer = () => {
        superBroadcast(events.updatePlayer, { sockets });
    };
    // sockets에서 targetID 소캣의 index 리턴
    const whereAmI = (targetID) => {
        const me = sockets.find((aSocket) => {
            if (aSocket.id === targetID)
                return true;
        });
        return sockets.indexOf(me);
    };
    // 방장이 변경될 때 클라이언트 소캣에게 알림
    const changeLeader = (leaderSocketID) => {
        leader = leaderSocketID;
        // 클라이언트에 알림
        if (leader)
            sendTo(leaderSocketID, events.leaderNotif, {});
        const myIndex = whereAmI(leader);
        if (sockets[myIndex].ready) {
            sockets[myIndex].ready = false;
            readyCount--;
        }
        console.log("changeLeader", leader);
    };
    // 게임 시작
    const gameStart = () => {
        // 게임 변수 초기화
        inPlaying = true;
        readyCount = 0;
        gameTurn = 0;
        // 단어 설정
        words = chooseWords(sockets.length);
        // 게임 시작 알리기
        for (let i in words) {
            sketchBook.push({id: sockets[i].id, word: words[i], history:[]});
            sockets[i].ready = false;
            finalTurn = Math.floor(sockets.length / 2) * 2;
            console.log(`${sockets[i].nickname} : ${words[i]}`);
            sendTo(sockets[i].id, events.gameStart, { word: words[i], maxTurn: finalTurn });
        }
        updatePlayer();
        console.log("gameStart! 진행되는 턴:", finalTurn);
    };
    // 게임 종료
    const terminateGame = () => {
        console.log("terminateGame..");
        // 게임 변수 초기화
        inPlaying = false;
        readyCount = 0;
        gameTurn = -1;
        finalTurn = -1;
        words = [];
        sketchBook = [];
        sockets.map((socket) => {
            socket.ready = false;
        });
        // 게임 종료 알리기
        superBroadcast(events.terminateGame, {});
        updatePlayer();
    };
    // 다음 턴 진행
    const nextTurn = () => {
        if (gameTurn === finalTurn) {
            // TODO: 리뷰 창 넘어가기
            console.log("nextTurn - 게임 완료!");
            terminateGame();
            return;
        }
        readyCount = 0;
        gameTurn++;
        sockets.map((socket) => {
            socket.ready = false;
        });
        superBroadcast(events.nextTurn, { currTurn: gameTurn });
        updatePlayer();
    };

    // 클라이언트가 접속할 때 관리 및 알림
    socket.on(events.logIn, ({ nickname }) => {
        console.log("logIn", nickname, socket.id);
        // 소캣 초기화
        socket.nickname = nickname;
        socket.ready = false;
        socket.leader = false;
        // sockets 반영
        sockets = sockets.filter(aSocket => aSocket.nickname !== socket.nickname);
        sockets.push({id: socket.id, nickname: nickname, leader: socket.leader, ready: socket.ready});
        if (sockets.length === 1)
            changeLeader(socket.id);
        // 새 플레이어 알림
        superBroadcast(events.helloPlayer, { nickname });
        // 플레이어 정보 업데이트
        updatePlayer();
    });

    // 플레이어가 로그아웃 할 때 관리 및 알림
    socket.on(events.logOut, () => {
        console.log("logOut", socket.nickname);
        // sockets에서 제거
        sockets = sockets.filter(aSocket => aSocket.id !== socket.id);
        // 방장이었으면 방장 재설정
        if (leader) {
            if (socket.id === leader) {
                if (sockets.length >= 1)
                    changeLeader(sockets[0].id);
                else
                    changeLeader(null);
            }
        }
        // 준비중이었을 때 처리
        if (socket.ready)
            readyCount--;
        // 게임중이었다면 게임 종료
        if (inPlaying)
            terminateGame();
            // 플레이어 나감 알림
        broadcast(events.byePlayer, { nickname: socket.nickname });
        // 플레이어 정보 업데이트
        updatePlayer();
    });

    // 플레이어가 메시지를 보낼 때
    socket.on(events.sendMessage, ({ message }) => {
        // 다른 플레이어들에게 메시지 전송
        superBroadcast(events.newMessage, { nickname: socket.nickname, message });
        console.log("sendMessage", message);
    });

    // 방장이 변경될 때 서버의 방장 소캣에 반영
    socket.on(events.leaderConfirm, ({}) => {
        socket.leader = true;
        socket.ready = false;
        const leaderIndex = whereAmI(leader);
        sockets[leaderIndex].leader = true;
        sockets[leaderIndex].ready = false;
        console.log("leaderConfirm", socket.nickname);
    });

    // 플레이어가 레디 버튼을 눌렀을 때
    socket.on(events.lobbyReady, ({ ready }) => {
        // 방장이 시작 버튼을 눌렀을 때 준비가 됐으면 게임 시작
        if (socket.id === leader) {
            if ((sockets.length >= 2) && (readyCount === sockets.length - 1)) {
                ready = true;
                // TODO: 게임 시작
                gameStart();
                return;
            } else {
                ready = false;
                console.log("lobbyReady: game start fail...");
            }
        }
        else {
            if (ready) {
                readyCount++;
            } else {
                readyCount--;
            }
        }
        // sockets에 상태 반영 후 알림
        socket.ready = ready;
        const myIndex = whereAmI(socket.id);
        sockets[myIndex].ready = ready;
        updatePlayer();
        console.log("lobbyReady:", socket.nickname, socket.ready, readyCount);
    });

    // 플레이어가 제출했을 때
    socket.on(events.gameSubmit, ({ data }) => {
        socket.ready = true;
        // 중복 제출인지 확인
        const myIndex = whereAmI(socket.id);
        let targetIndex = null;
        // 플레이어가 홀수일 때
        if ((gameTurn === 0) || (finalTurn !== sockets.length))
            targetIndex = (myIndex + gameTurn) % sockets.length
        // 플레이어가 짝수일 때
        else
            targetIndex = (myIndex + gameTurn + sockets.length - 1) % sockets.length
        if (sockets[myIndex].ready) {
            sketchBook[targetIndex].history[gameTurn] = data;
        }
        else {
            readyCount++;
            sketchBook[targetIndex].history.push(data);
            sockets[myIndex].ready = true;
            updatePlayer();
        }
        console.log(sketchBook);
        if (readyCount === sockets.length) {
            console.log("gameSubmit: 제출 완료!");
            nextTurn();
        }
    });

    // 플레이어가 그릴 제시어를 요청할 때
    socket.on(events.letMeDraw, ({}) => {
        const myIndex = whereAmI(socket.id);
        let targetIndex = null;
        // 플레이어가 홀수일 때
        if ((gameTurn === 0) || (finalTurn !== sockets.length))
            targetIndex = (myIndex + gameTurn) % sockets.length
        // 플레이어가 짝수일 때
        else
            targetIndex = (myIndex + gameTurn + sockets.length - 1) % sockets.length
        const data = sketchBook[targetIndex].history[gameTurn - 1];
        sendTo(socket.id, events.drawThis, { word: data });
        console.log("letMeDraw - 그릴 단어:", data);
    });

    // 플레이어가 맞출 그림을 요청할 때
    socket.on(events.letMeGuess, ({}) => {
        const myIndex = whereAmI(socket.id);
        let targetIndex = null;
        // 플레이어가 홀수일 때
        if ((gameTurn === 0) || (finalTurn !== sockets.length))
            targetIndex = (myIndex + gameTurn) % sockets.length
        // 플레이어가 짝수일 때
        else
            targetIndex = (myIndex + gameTurn + sockets.length - 1) % sockets.length
        const data = sketchBook[targetIndex].history[gameTurn - 1];
        sendTo(socket.id, events.guessThis, { drawing: data });
        console.log("letMeGuess - 맞출 그림:", data);
    });
};

export default socketController;