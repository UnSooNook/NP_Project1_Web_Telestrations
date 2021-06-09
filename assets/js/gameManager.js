import { getMySocket } from "./mySocket";

// 게임 진행 중 여부
let inPlaying = false;
// 게임 턴
let gameTurn = -1;
// 게임이 끝나는 턴
let finalTurn = -1;
// 게임 타이머
let timer = null;
// 현재 게임 모드 (0: word, 1: drawing, 2: answer)
let currMode = -1;
// 제출 여부 (타이머 이벤트에서 처리)
let submit = false;

// 게임 시작 이벤트 처리
export const handleGameStart = ({ word, maxTurn }) => {
    inPlaying = true;
    gameTurn = 0;
    finalTurn = maxTurn;
    currMode = 0;
    // TODO: 제시어 띄우기, 타이머 시작
    console.log("gameManager - gameStart!", word);
};

// 게임 초기화 이벤트 처리
export const handleTerminateGame = ({}) => {
    inPlaying = false;
    gameTurn = -1;
    finalTurn = -1;
    currMode = -1;
    submit = false;
    console.log("gameManager - terminateGame..");
}

// 다음 턴 이벤트 처리
export const handleNextTurn = ({ currTurn }) => {
    gameTurn = currTurn;
    // 그릴 단어 요청
    if (currTurn % 2 === 1) {
        getMySocket().emit(window.events.letMeDraw, {});
        currMode = 1;
    }
    // 맞출 그림 요청
    else {
        getMySocket().emit(window.events.letMeGuess, {});
        currMode = 2;
    }
    console.log("gameManager - handleNextTurn", gameTurn);
};

// 게임 내용 제출
const gameSubmit = (data) => {
    getMySocket().emit(window.events.gameSubmit, { data: data });
    submit = true;
};

// 제출 버튼 이벤트 처리
const handleGameSubmit = (e) => {
    e.preventDefault();
    // 현재 게임 모드에 따라 제출
    // 제시어
    if (currMode === 0) {
        console.log("gameManager - handleGameSubmit 제시어 제출")
        // TODO: 제시어 가져오기
        gameSubmit(`${getMySocket().nickname}: 제시어`);
    }
    // 그리기
    else if (currMode === 1) {
        console.log("gameManager - handleGameSubmit 그리기 제출")
        // TODO: 그림 가져오기
        gameSubmit(`${getMySocket().nickname}'s 그림`);
    }
    // 그림 맞추기
    else {
        console.log("gameManager - handleGameSubmit 맞추기 제출")
        // TODO: 정답 가져오기
        gameSubmit(`${getMySocket().nickname}'s 정답`);
    }
}

// 그릴 단어를 받았을 때
export const handleDrawThis = ({ word }) => {
    console.log("gameManager - handleDrawThis:", word);
    // TODO: 단어 표시, 타이머 시작, 그리기
};

// 맞출 단어를 받았을 때
export const handleGuessThis = ({ drawing }) => {
    console.log("gameManager - handleDrawThis:", drawing);
    // TODO: 그림 표시, 타이머 시작, 맞추기
};

/////////////////////////////////////////////////////////////////////////
const submitButton = document.getElementById("jsSubmitButton");

if (submitButton) {
    submitButton.addEventListener("click", handleGameSubmit);
}
/////////////////////////////////////////////////////////////////////////
