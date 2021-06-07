import {
    disableCanvas,
    hideControls,
    enableCanvas,
    showControls,
    resetCanvas,
} from "./paint";

const board = document.getElementById("jsBoard");
const notifs = document.getElementById("jsNotifs");

// 플레이어 업데이트 함수
const addPlayers = (players) => {
    // // 초기화
    // board.innerHTML = "";
    // // 플레이어들 정보 전부 작성
    // players.forEach((player) => {
    //     const playerElement = document.createElement("span");
    //     playerElement.innerText = `${player.nickname}: ${player.points}`;
    //     board.appendChild(playerElement);
    // });
};

// 공지 수정
const setNotifs = (text) => {
    notifs.innerText = "";
    notifs.innerText = text;
};

// 플레이어 업데이트
export const handlePlayerUpdate = ({ sockets }) => {
    addPlayers(sockets);
};

// 게임 시작
export const handleGameStarted = () => {
    // 공지 지우기
    setNotifs("");
    // 그리기 해제
    disableCanvas();
    hideControls();
};

// 방장, 단어 공지
export const handleLeaderNotif = ({ word }) => {
    enableCanvas();
    showControls();
    notifs.innerText = `You are the leader, paint: ${word}`;
};

// 게임 종료
export const handleGameEnded = () => {
    setNotifs("Game ended.");
    disableCanvas();
    hideControls();
    resetCanvas();
};

// 게임 시작 공지
export const handleGameStarting = () => {
    setNotifs("Game will start soon");
};

enableCanvas();
