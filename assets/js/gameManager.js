import { getMySocket } from "./mySocket";

// 게임 진행 중 여부
let inPlaying = false;
// 게임 스케치북
let sketchBook = [];
// 스케치북 페이지 수
let sketchBookPage = 0;
// 마지막 누적 페이지
let finalPage = 0;
// 현제 스케치북 페이지
let currPage = -1;
// 게임 턴
let gameTurn = -1;
// 게임이 끝나는 턴
let finalTurn = -1;
// 게임 타이머
let timer = null;
// 남은 시간
let timeRemaining = 0;
// 현재 게임 모드 (0: word, 1: drawing, 2: answer)
let currMode = -1;
// 제출 여부
let submit = false;
// 한 턴 당 제한 시간
const TIMELIMIT = 2;

// 타이머 함수 (1초마다 반복)
const handleTimer = () => { 
    timeRemaining--;   
    console.log("timer:", timeRemaining);
    if (timeRemaining === 0) {
        console.log("Time Expired");
        gameSubmit();
        clearInterval(timer);
    }
};

// 게임 시작 이벤트 처리
export const handleGameStart = ({ word, maxTurn }) => {
    inPlaying = true;
    gameTurn = 0;
    finalTurn = maxTurn;
    currMode = 0;
    // TODO: 제시어 띄우기
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
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
    // 타이머 해제
    clearInterval(timer);
    gameTurn = currTurn;
    // 그릴 단어 요청
    if (currTurn % 2 === 1) {
        currMode = 1;
        getMySocket().emit(window.events.letMeDraw, {});
    }
    // 맞출 그림 요청
    else {
        currMode = 2;
        getMySocket().emit(window.events.letMeGuess, {});
    }
    console.log("gameManager - handleNextTurn", gameTurn);
};

// 게임 내용 제출
const gameSubmit = () => {
    let data = null;
    // 현재 게임 모드에 따라 제출
    // 제시어
    if (currMode === 0) {
        console.log("gameManager - handleGameSubmit 제시어 제출")
        // TODO: 제시어 가져오기
        data = `${getMySocket().nickname}: 제시어`;
    }
    // 그리기
    else if (currMode === 1) {
        console.log("gameManager - handleGameSubmit 그리기 제출")
        // TODO: 그림 가져오기
        data = `${getMySocket().nickname}'s 그림`;
    }
    // 그림 맞추기
    else {
        console.log("gameManager - handleGameSubmit 맞추기 제출")
        // TODO: 정답 가져오기
        data = `${getMySocket().nickname}'s 정답`;
    }
    getMySocket().emit(window.events.gameSubmit, { data: data });
    submit = true;
};

// 제출 버튼 이벤트 처리
const handleGameSubmit = (e) => {
    e.preventDefault();
    gameSubmit();
}

// 그릴 단어를 받았을 때
export const handleDrawThis = ({ word }) => {
    console.log("gameManager - handleDrawThis:", word);
    // TODO: 단어 표시, 그리기
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
};

// 맞출 단어를 받았을 때
export const handleGuessThis = ({ drawing }) => {
    console.log("gameManager - handleGuessThis:", drawing);
    // TODO: 그림 표시, 맞추기
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
};

// 리뷰창 페이지 업데이트하기
const pageUpdate = () => {
    const myPage = currPage % sketchBookPage;
    if (myPage === 0)
        currMode = 0;
    else if (myPage % 2 === 1)
        currMode = 1;
    else
        currMode = 2;
    const player = Math.floor(currPage / sketchBookPage);
    const data = sketchBook[player].history[myPage];
    console.log("gameManager - pageUpdate:", player, myPage, data);
};

// 게임이 완료되었을 때 리뷰창으로 넘어가기
export const handleGameEnd = ({ finalSketchBook }) => {
    // 타이머 해제
    clearInterval(timer);
    sketchBook = finalSketchBook;
    sketchBookPage = finalSketchBook[0].history.length;
    finalPage = finalSketchBook.length * finalSketchBook[0].history.length;
    currPage = 0;
    if (getMySocket().leader) {
        getMySocket().emit(window.events.updatePageNum, { newPage: currPage });
    }
};

// 페이지 업데이트 이벤트 처리
export const handleUpdatePage = ({ newPage }) => {
    currPage = newPage;
    console.log("gameManager - handlePageUpdate", currPage);
    pageUpdate();
};

// 이전 페이지 버튼 이벤트 처리
export const handlePrevPage = (e) => {
    e.preventDefault();
    if (currPage !== 0) {
        currPage--;
        getMySocket().emit(window.events.updatePageNum, { newPage: currPage });
    }
}

// 다음 페이지 버튼 이벤트 처리
export const handleNextPage = (e) => {
    e.preventDefault();
    if (currPage !== (finalPage - 1)) {
        currPage++;
        getMySocket().emit(window.events.updatePageNum, { newPage: currPage });
    }
}

/////////////////////////////////////////////////////////////////////////
const submitButton = document.getElementById("jsSubmitButton");
const prevButton = document.getElementById("jsPrevButton");
const nextButton = document.getElementById("jsNextButton");

if (submitButton) {
    submitButton.addEventListener("click", handleGameSubmit);
    prevButton.addEventListener("click", handlePrevPage);
    nextButton.addEventListener("click", handleNextPage);
}
/////////////////////////////////////////////////////////////////////////
