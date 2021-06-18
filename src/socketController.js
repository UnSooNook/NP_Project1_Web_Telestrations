import { chooseColors } from "./colors.js";
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
// 명령어 모음
const commands = ["명령어", "만든이", "플레이어", "방장변경", "셔플", "닉변경"];
// 소켓 이벤트 처리
const socketController = (socket, io) => {
    /* 통신을 위한 함수 */
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

    /* 서버 및 게임 관리 함수 */
    // 플레이어 정보 업데이트 알림
    const updatePlayer = () => {
        updateReadyCount();
        superBroadcast(events.updatePlayer, { sockets });
    };
    // sockets에서 targetID 소캣의 index 리턴
    const whereAmI = (targetID) => {
        const me = sockets.find((aSocket) => {
            if (aSocket.id === targetID) return true;
        });
        return sockets.indexOf(me);
    };
    const updateReadyCount = () => {
        readyCount = 0;
        sockets.forEach((player) => {
            if (player.ready)
                readyCount++;
        });
    }
    // 방장이 변경될 때 클라이언트 소캣에게 알림
    const changeLeader = (leaderSocketID) => {
        leader = leaderSocketID;
        // 클라이언트에 알림
        if (leader) {
            sendTo(leaderSocketID, events.leaderNotif, {});
            const myIndex = whereAmI(leader);
            if ((myIndex > -1) && (sockets[myIndex].ready)) {
                sockets[myIndex].ready = false;
                updateReadyCount();
            }
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
            sketchBook.push({
                id: sockets[i].id,
                nickname: sockets[i].nickname,
                color: sockets[i].color,
                word: words[i],
                history: [],
            });
            sockets[i].ready = false;
            finalTurn = Math.floor(sockets.length / 2) * 2;
            console.log(`${sockets[i].nickname} : ${words[i]}`);
            sendTo(sockets[i].id, events.gameStart, {
                word: words[i],
                maxTurn: finalTurn,
            });
        }
        superBroadcast(events.serverMessage, {
            message: `주어진 제시어를 적어주세요. `,
            messageColor: "green",
        });
        updatePlayer();
        console.log("gameStart! 진행되는 턴:", finalTurn, sockets.length);
    };
    // 게임 완료
    const gameEnd = () => {
        console.log("gameEnd!");
        inPlaying = false;
        superBroadcast(events.gameEnd, { finalSketchBook: sketchBook });
        readyCount = 0;
        sockets.map((socket) => {
            socket.ready = false;
        });
        updatePlayer();
        superBroadcast(events.serverMessage, {
            message: `게임이 종료되었습니다.`,
            messageColor: "green",
        });
    };
    // 게임 초기화
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
        superBroadcast(events.terminateGameNotif, {});
        updatePlayer();
        superBroadcast(events.serverMessage, {
            message: `로비로 돌아갑니다.`,
            messageColor: "red",
        });
    };
    // 다음 턴 진행
    const nextTurn = () => {
        if (gameTurn === finalTurn) {
            console.log("nextTurn - 게임 완료!");
            gameEnd();
            return;
        }
        readyCount = 0;
        gameTurn++;
        sockets.map((socket) => {
            socket.ready = false;
        });
        superBroadcast(events.nextTurn, { currTurn: gameTurn });
        if (gameTurn % 2) {
            superBroadcast(events.serverMessage, {
                message: `턴 ${gameTurn}/${finalTurn}\n그림을 그려주세요.`,
                messageColor: "darkBlue",
            });
        }
        else {
            superBroadcast(events.serverMessage, {
                message: `턴 ${gameTurn}/${finalTurn}\n그림을 맞춰주세요.`,
                messageColor: "purple",
            });
        }
        updatePlayer();
    };
    // 명령어 처리
    const handleCommand = (message, command) => {
        const commandColor = "#34495e";
        const errorColor = "#7f8c8d";
        switch (command) {
            // !명령어
            case commands[0]:
                if (message === `!${command}`) {
                    let allCommands = `명령어: ${commands[1]}`;
                    commands.forEach((com) => {
                        if (com !== commands[0] && com !== commands[1])
                            allCommands = `${allCommands}, ${com}`;
                    });
                    superBroadcast(events.newMessage,  {
                        message: allCommands,
                        messageColor: commandColor
                    });
                } else {
                    sendTo(socket.id, events.newMessage,  {
                        message: `사용법: !${command}`,
                        messageColor: errorColor
                    });
                }
                break;
            // !만든이
            case commands[1]:
                if (message === `!${command}`) {
                    superBroadcast(events.newMessage,  {
                        message: "만든이: 운수눅 (<a href='https://github.com/UnSooNook' target='_blank'>Github</a>)",
                        messageColor: commandColor
                    });
                } else {
                    sendTo(socket.id, events.newMessage,  {
                        message: `사용법: !${command}`,
                        messageColor: errorColor
                    });
                }
                break;
            // !플레이어
            case commands[2]:
                if (message === `!${command}`) {
                    let allPlayers = `플레이어(${sockets.length}): ${sockets[0].nickname}`;
                    sockets.forEach((player) => {
                        if (player.nickname !== sockets[0].nickname)
                            allPlayers = `${allPlayers}, ${player.nickname}`;
                    });
                    superBroadcast(events.newMessage,  {
                        message: allPlayers,
                        messageColor: commandColor
                    });
                } else {
                    sendTo(socket.id, events.newMessage,  {
                        message: `사용법: !${command}`,
                        messageColor: errorColor
                    });
                }
                break;
            // 방장변경
            case commands[3]:
                if (socket.leader) {
                    if (message.split(" ").length === 2) {
                        const myIndex = whereAmI(socket.id);
                        const newLeader = message.split(" ")[1];
                        let leaderID = null;
                        const leaderIndex = sockets.find((player) => {
                            if (newLeader === player.nickname) {
                                leaderID = player.id;
                                return true;
                            }
                        });
                        if (leaderIndex) {
                            sockets[myIndex].leader = false;
                            socket.leader = false;
                            changeLeader(leaderID);
                            updatePlayer();
                        }
                        else {
                            sendTo(socket.id, events.newMessage,  {
                                message: `${newLeader}가 없습니다.`,
                                messageColor: errorColor
                            });
                        }
                    } else {
                        sendTo(socket.id, events.newMessage,  {
                            message: `사용법: !${command} [플레이어]`,
                            messageColor: errorColor
                        });
                    }
                } else {
                    sendTo(socket.id, events.newMessage,  {
                        message: `방장이 아닙니다!`,
                        messageColor: errorColor
                    });
                }
                break;
            // 셔플
            case commands[4]:
                if (socket.leader) {
                    if (message === `!${command}`) {
                        sockets.sort(() => Math.random() - 0.5);
                        superBroadcast(events.newMessage,  {
                            message: "순서가 섞였습니다! 자신의 순서를 확인해주세요.",
                            messageColor: commandColor
                        });
                        updatePlayer();
                    } else {
                        sendTo(socket.id, events.newMessage,  {
                            message: `사용법: !${command}`,
                            messageColor: errorColor
                        });
                    }
                } else {
                    sendTo(socket.id, events.newMessage,  {
                        message: `방장이 아닙니다!`,
                        messageColor: errorColor
                    });
                }
                break;
            // 닉변경
            case commands[5]:
                if (message.split(" ").length === 2) {
                    const prevNickname = socket.nickname;
                    const newNickname = message.split(" ")[1];
                    const isAlreadyUsed = sockets.find((player) => {
                        if (newNickname === player.nickname)
                            return true;
                    });
                    if (isAlreadyUsed) {
                        sendTo(socket.id, events.newMessage,  {
                            message: `닉네임 '${newNickname}'이(가) 이미 사용중입니다.`,
                            messageColor: errorColor
                        });
                    }
                    else {
                        const myIndex = whereAmI(socket.id);
                        sockets[myIndex].nickname = newNickname;
                        socket.nickname = newNickname;
                        superBroadcast(events.newMessage,  {
                            message: `${prevNickname}님이 ${newNickname}(으)로 변경되었습니다.`,
                            messageColor: commandColor
                        });
                        updatePlayer();
                    }
                } else {
                    sendTo(socket.id, events.newMessage,  {
                        message: `사용법: !${command} [닉네임]`,
                        messageColor: errorColor
                    });
                }
                break;
        }
    };

    /* 소캣 이벤트 처리 함수 */
    // 플레이어가 접속할 때 관리 및 알림 처리 함수
    const handleLogInS = ({ nickname }) => {
        if (inPlaying === false) {
            console.log("logIn", nickname, socket.id);
            // 소캣 초기화
            socket.nickname = nickname;
            // socket.color = "#" + Math.round(Math.random() * 0xffffff).toString(16); // 플레이어 색상 랜덤 배정\
            socket.color = chooseColors(sockets);
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
                color: socket.color,
            });
            if (sockets.length === 1) changeLeader(socket.id);
            // 새 플레이어 알림
            superBroadcast(events.helloPlayer, { nickname });
        } else {
            console.log(`Player ${nickname} Logged In while Playing Game`);
        }
        // 플레이어 정보 업데이트
        updatePlayer();
    };
    // 플레이어가 로그아웃 할 때 관리 및 알림 처리 함수
    const handleLogOutS = () => {
        console.log("logOut", socket.nickname);
        const myIndex = whereAmI(socket.id);
        if (myIndex === -1) return;
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
    };
    // 플레이어가 메시지를 보낼 때 처리 함수
    const handleSendMessageS = ({ message, messageColor }) => {
        // 플레이어들에게 메시지 전송
        broadcast(events.newMessage, {
            name: socket.nickname,
            nameColor: socket.color,
            message,
            messageColor,
        });
        console.log(`sendMessage ${socket.nickname}: ${message}`);
        // 명령어 처리
        commands.forEach((command) => {
            if (message.split(" ")[0] === `!${command}`)
                handleCommand(message, command);
        });
    };
    // 방장이 변경될 때 서버의 방장 소캣에 알림 처리 함수
    const handleLeaderConfirmS = ({}) => {
        socket.leader = true;
        socket.ready = false;
        const leaderIndex = whereAmI(leader);
        sockets[leaderIndex].leader = true;
        sockets[leaderIndex].ready = false;
        superBroadcast(events.serverMessage, {
            message: `${socket.nickname}님이 방장이 되었습니다.`,
            messageColor: "orange",
        });
        // 플레이어 정보 업데이트
        updatePlayer();
        console.log("leaderConfirm", socket.nickname);
    };
    // 플레이어가 준비 버튼을 눌렀을 때 처리 함수
    const handleLobbyReadyS = ({ ready }) => {
        // 방장이 시작 버튼을 눌렀을 때 준비가 됐으면 게임 시작
        if (socket.id === leader) {
            if (sockets.length >= 2 && readyCount === sockets.length - 1) {
                if (inPlaying === false) {
                    inPlaying = true;
                    console.log("lobbyReady - gameStart");
                    ready = true;
                    // 게임 시작 채팅 알림 (5초 카운트)
                    let startCount = 5;
                    superBroadcast(events.serverMessage, {
                        message: `게임이 곧 시작됩니다...${startCount}`,
                        messageColor: "red",
                    });
                    const startTimer = setInterval(() => {
                        // 5초 후 게임 시작
                        startCount--;
                        if (startCount === -1 && startTimer) {
                            clearInterval(startTimer);
                            gameStart();
                            return;
                        }
                        superBroadcast(events.serverMessage, {
                            message: `게임이 곧 시작됩니다...${startCount}`,
                            messageColor: "red",
                        });
                    }, 1000);
                }
                return;
            } else {
                ready = false;
                // 게임 시작 방장에게 불가능 채팅 알림
                if (sockets.length === 1) {
                    sendTo(leader, events.serverMessage, {
                        message: `왜 안되지? 앗 나 혼자구나...`,
                        messageColor: "red",
                    });
                } else {
                    sendTo(leader, events.serverMessage, {
                        message: `모든 플레이어가 준비하지 않아 게임을 시작할 수 없습니다.`,
                        messageColor: "red",
                    });
                }
                console.log("lobbyReady: game start fail...");
            }
        }
        // sockets에 상태 반영 후 알림
        socket.ready = ready;
        const myIndex = whereAmI(socket.id);
        if (myIndex > -1) {
            sockets[myIndex].ready = ready;
            // 플레이어 정보 업데이트
            updatePlayer();
            console.log("lobbyReady:", socket.nickname, socket.ready, readyCount);
        }
    };
    // 플레이어가 제출했을 때 처리 함수
    const handleGameSubmitS = ({ data, ready }) => {
        if (inPlaying) {
            socket.ready = ready;
            // 중복 제출인지 확인
            const myIndex = whereAmI(socket.id);
            if (myIndex > -1) {
                let targetIndex = null;
                // 플레이어가 홀수일 때
                if (gameTurn === 0 || finalTurn !== sockets.length)
                    targetIndex = (myIndex - gameTurn + sockets.length) % sockets.length;
                // 플레이어가 짝수일 때
                else
                    targetIndex = (myIndex - gameTurn + sockets.length * 2 + 1) % sockets.length;
                // 스케치북에 저장
                // 다시 제출
                if (sketchBook[targetIndex].history.length > gameTurn ) {
                    if (ready) {
                        sketchBook[targetIndex].history[gameTurn] = data;
                    } 
                }
                // 첫 제출
                else {
                    sketchBook[targetIndex].history.push(data);
                }
                sockets[myIndex].ready = ready;
                updatePlayer();
                if (ready) console.log(`handleGameSubmitS: ${socket.nickname} 제출`);
                else console.log(`handleGameSubmitS: ${socket.nickname} 제출 취소`);
                if (readyCount === sockets.length) {
                    console.log("gameSubmit: 모두 제출 완료!");
                    nextTurn();
                }
            }
        }
    };
    // 플레이어가 그림 제시어를 요청할 때 처리 함수
    const handleLetMeDrawS = ({}) => {
        const myIndex = whereAmI(socket.id);
        if (myIndex > -1) {
            let targetIndex = null;
            // 플레이어가 홀수일 때
            if (gameTurn === 0 || finalTurn !== sockets.length)
                targetIndex = (myIndex - gameTurn + sockets.length) % sockets.length;
            // 플레이어가 짝수일 때
            else
                targetIndex =
                    (myIndex - gameTurn + sockets.length * 2 + 1) % sockets.length;
            const data = sketchBook[targetIndex].history[gameTurn - 1];
            sendTo(socket.id, events.drawThis, { word: data });
            console.log("letMeDraw - 그릴 단어:", data);
        }
    };
    // 플레이어가 맞출 그림을 요청할 때 처리 함수
    const handleLetMeGuessS = ({}) => {
        const myIndex = whereAmI(socket.id);
        if (myIndex > -1) {
            let targetIndex = null;
            // 플레이어가 홀수일 때
            if (gameTurn === 0 || finalTurn !== sockets.length)
                targetIndex = (myIndex - gameTurn + sockets.length) % sockets.length;
            // 플레이어가 짝수일 때
            else
                targetIndex =
                    (myIndex - gameTurn + sockets.length * 2 + 1) % sockets.length;
            const data = sketchBook[targetIndex].history[gameTurn - 1];
            sendTo(socket.id, events.guessThis, { drawing: data });
            console.log("letMeGuess - 맞출 스케치북:", sketchBook[targetIndex].nickname);
        }
    };
    // 리뷰창에서 페이지가 넘어갈 때 처리함수
    const handleUpdatePageNumS = ({ newPage }) => {
        console.log("updatePageNum:", newPage);
        superBroadcast(events.updatePage, { newPage: newPage });
    };
    // 게임이 종료될 때 처리 함수
    const handleTerminateGameS = ({}) => {
        terminateGame();
    };

    /* 소캣 이벤트 처리 함수 등록 */
    // 플레이어가 접속할 때
    socket.on(events.logIn, handleLogInS);
    // 플레이어가 로그아웃 할 때
    socket.on(events.logOut, handleLogOutS);
    // 플레이어가 메시지를 보낼 때
    socket.on(events.sendMessage, handleSendMessageS);
    // 방장이 변경될 때
    socket.on(events.leaderConfirm, handleLeaderConfirmS);
    // 플레이어가 레디 버튼을 눌렀을 때
    socket.on(events.lobbyReady, handleLobbyReadyS);
    // 플레이어가 제출했을 때
    socket.on(events.gameSubmit, handleGameSubmitS);
    // 플레이어가 그릴 제시어를 요청할 때
    socket.on(events.letMeDraw, handleLetMeDrawS);
    // 플레이어가 맞출 그림을 요청할 때
    socket.on(events.letMeGuess, handleLetMeGuessS);
    // 리뷰창에서 페이지가 넘어갈 때
    socket.on(events.updatePageNum, handleUpdatePageNumS);
    // 게임 종료 이벤트 처리
    socket.on(events.terminateGame, handleTerminateGameS)
};

export default socketController;
