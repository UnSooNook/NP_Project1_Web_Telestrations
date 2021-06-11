import { handleNewMessage, handleServerMessage } from "./chat";
import { handleDrawThis, handleGameEnd, handleGameStart, handleGuessThis, handleNextTurn, handleTerminateGame, handleTerminateGameNotif, handleUpdatePage } from "./gameManager";
import { handleByePlayer, handleHelloPlayer } from "./logIn";
import { handleUpdatePlayer, handleLeaderNotif } from "./players";

// 내 정보 관리
let socket = null;

// 내 소켓 리턴
export const getMySocket = () => {
	return socket;
};

// 내 소켓 정보 업데이트
export const updateMySocket = ( aSocket ) => {
	if (aSocket) {
		socket.nickname = aSocket.nickname;
		socket.ready = aSocket.ready;
		socket.leader = aSocket.leader;
		socket.color = aSocket.color;
	}
	else {
		// TODO: 로그인 실패 시
		console.log("A game has been playing. Try Again Later~");
	}
};

// 소켓 초기 설정
export const initMySocket = ( aSocket ) => {
	const { events } = window;
	socket = aSocket;
	// 소켓 이벤트 리스너 추가
	socket.on(events.updatePlayer, handleUpdatePlayer);
	socket.on(events.helloPlayer, handleHelloPlayer);
	socket.on(events.byePlayer, handleByePlayer);
	socket.on(events.leaderNotif, handleLeaderNotif);
    socket.on(events.newMessage, handleNewMessage);
	socket.on(events.serverMessage, handleServerMessage);
	socket.on(events.gameStart, handleGameStart);
	socket.on(events.nextTurn, handleNextTurn);
	socket.on(events.drawThis, handleDrawThis);
	socket.on(events.guessThis, handleGuessThis);
	socket.on(events.gameEnd, handleGameEnd);
	socket.on(events.updatePage, handleUpdatePage);
	socket.on(events.terminateGameNotif, handleTerminateGameNotif);
};