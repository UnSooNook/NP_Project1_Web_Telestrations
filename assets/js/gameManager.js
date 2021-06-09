import { getMySocket } from "./mySocket";

const readyBtn = document.querySelector(".canvas__btn__ready");
const submitBtn = document.querySelector(".canvas__btn__submit");
const helpContainer = document.querySelector(".help__container");
const modContainer = [
    document.querySelector(".mod0__container"),
    document.querySelector(".mod1__container"),
    document.querySelector(".mod2__container"),
];
const reviewContainer = document.querySelector(".review__container");
const prevBtn = document.querySelector(".review__btn__prev");
const nextBtn = document.querySelector(".review__btn__next");

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
// 한 턴 당 제한 시간(초)
const TIMELIMIT = 10;

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

// currMode에 맞는 화면 띄우기
const enableModView = (number) => {
    readyBtn.classList.add("hidden");
    helpContainer.classList.add("hidden");
    submitBtn.classList.remove("hidden");
    modContainer.map((container) => container.classList.add("hidden"));
    modContainer[number].classList.remove("hidden");
};

// 각 모드에 맞는 Submit 핸들러
// 제출 버튼 또는 엔터키 이벤트 처리
const handleGameSubmit = [
    // mod 0
    (e) => {
        e.preventDefault();
        const submitWord = modContainer[0].querySelector(".submitWord");
        const form = modContainer[0].querySelector("form");
        const input = form.querySelector("input");
        const { value } = input;
        input.value = "";
        submitWord.querySelector(".word").innerHTML = value;
        form.classList.add("hidden");
        submitBtn.classList.add("hidden");
        submitWord.classList.remove("hidden");
        gameSubmit(value);
    },
    // mod 1
    (e) => {
        e.preventDefault();
        // TODO: get canvas data
        const drawing = "그림";
        submitBtn.classList.add("hidden");
        gameSubmit(drawing);
    },
    // mod 2
    (e) => {
        e.preventDefault();
        const submitWord = modContainer[2].querySelector(".submitWord");
        const form = modContainer[2].querySelector("form");
        const input = form.querySelector("input");
        const { value } = input;
        input.value = "";
        submitWord.querySelector(".word").innerHTML = value;
        form.classList.add("hidden");
        submitBtn.classList.add("hidden");
        submitWord.classList.remove("hidden");
        gameSubmit(value);
    },
];

// 선택된 Mod에 컨텐츠 및 핸들러 해제 (초기화)
const deactiveMod = [
    // mod 0
    () => {
        modContainer[0]
            .querySelectorAll(".word")
            .forEach((element) => (element.innerHTML = ""));
        const form = modContainer[0].querySelector("form");
        form.classList.remove("hidden");
        form.removeEventListener("submit", handleGameSubmit[0]);
        submitBtn.classList.remove("hidden");
        submitBtn.removeEventListener("click", handleGameSubmit[0]);
        const submitWord = modContainer[0].querySelector(".submitWord");
        submitWord.classList.add("hidden");
    },
    // mod 1
    () => {
        modContainer[1].querySelector(".word").innerHTML = "";
        // TODO: canvas deactive
        submitBtn.classList.remove("hidden");
        submitBtn.removeEventListener("click", handleGameSubmit[1]);
    },
    // mod 2
    () => {
        modContainer[2].querySelector(".word").innerHTML = "";
        const form = modContainer[2].querySelector("form");
        form.classList.remove("hidden");
        form.removeEventListener("submit", handleGameSubmit[2]);
        submitBtn.classList.remove("hidden");
        submitBtn.removeEventListener("click", handleGameSubmit[2]);
        const submitWord = modContainer[2].querySelector(".submitWord");
        submitWord.classList.add("hidden");
    },
];

// currMode에 맞는 화면에 컨텐츠 배치 함수 배열
const activeMod = [
    // mod 0
    (word) => {
        modContainer[0].querySelector(".word").innerHTML = word;
        const form = modContainer[0].querySelector("form");
        form.addEventListener("submit", handleGameSubmit[0]);
        submitBtn.addEventListener("click", handleGameSubmit[0]);
    },
    // mod 1
    (word) => {
        modContainer[1].querySelector(".word").innerHTML = word;
        // TODO: canvas active
        submitBtn.addEventListener("click", handleGameSubmit[1]);
    },
    // mod 2
    (drawing) => {
        // TODO: show drawing
        const form = modContainer[2].querySelector("form");
        form.addEventListener("submit", handleGameSubmit[2]);
        submitBtn.addEventListener("click", handleGameSubmit[2]);
    },
];

// 게임 모드를 선택하는 함수
const selectMod = (modNumber, data) => {
    deactiveMod.map((deactive) => deactive.call(this));
    enableModView(modNumber);
    activeMod[modNumber].call(this, data);
};

// 리뷰 화면 View 보이게 설정
const enableReviewView = () => {
    readyBtn.classList.add("hidden");
    submitBtn.classList.add("hidden");
    helpContainer.classList.add("hidden");
    modContainer.map((element) => element.classList.add("hidden"));
    reviewContainer.classList.remove("hidden");
    prevBtn.classList.remove("hidden");
    prevBtn.addEventListener("click", handlePrevPage);
    nextBtn.classList.remove("hidden");
    nextBtn.addEventListener("click", handleNextPage);
};

// 리뷰 화면 컨텐츠 띄우기
const activeReview = (data) => {
    reviewContainer.innerHTML = data;
    // TODO : data로 화면 그리기
};

// 게임 종료 후 View 초기화
const clearAllView = () => {
    // TODO : 모든 뷰 초기화
};

// 게임 시작 이벤트 처리
export const handleGameStart = ({ word, maxTurn }) => {
    inPlaying = true;
    gameTurn = 0;
    finalTurn = maxTurn;
    currMode = 0;
    selectMod(currMode, word);
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
    clearAllView();
    console.log("gameManager - terminateGame..");
};

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
const gameSubmit = (data) => {
    // 현재 게임 모드에 따라 제출
    // 제시어
    if (currMode === 0) {
        console.log("gameManager - handleGameSubmit 제시어 제출");
        // TODO: 제시어 가져오기
        // data = `${getMySocket().nickname}: 제시어`;
    }
    // 그리기
    else if (currMode === 1) {
        console.log("gameManager - handleGameSubmit 그리기 제출");
        // TODO: 그림 가져오기
        data = `${getMySocket().nickname}'s 그림`;
    }
    // 그림 맞추기
    else {
        console.log("gameManager - handleGameSubmit 맞추기 제출");
        // TODO: 정답 가져오기
        // data = `${getMySocket().nickname}'s 정답`;
    }
    getMySocket().emit(window.events.gameSubmit, { data: data });
    submit = true;
};

// 그릴 단어를 받았을 때
export const handleDrawThis = ({ word }) => {
    console.log("gameManager - handleDrawThis:", word);
    submit = false; // 내가 추가한건데 여기 들어가는 거 맞지?
    selectMod(currMode, word);
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
};

// 맞출 단어를 받았을 때
export const handleGuessThis = ({ drawing }) => {
    console.log("gameManager - handleGuessThis:", drawing);
    submit = false; // 내가 추가한건데 여기 들어가는 거 맞지?
    selectMod(currMode, drawing);
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
};

// 리뷰창 페이지 업데이트하기
const pageUpdate = () => {
    const myPage = currPage % sketchBookPage;
    if (myPage === 0) currMode = 0;
    else if (myPage % 2 === 1) currMode = 1;
    else currMode = 2;
    const player = Math.floor(currPage / sketchBookPage);
    const data = sketchBook[player].history[myPage];
    // 리뷰화면 다시 그리기
    activeReview(data);
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
    // 리뷰창 활성화
    enableReviewView();
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
};

// 다음 페이지 버튼 이벤트 처리
export const handleNextPage = (e) => {
    e.preventDefault();
    if (currPage !== finalPage - 1) {
        currPage++;
        getMySocket().emit(window.events.updatePageNum, { newPage: currPage });
    }
};
