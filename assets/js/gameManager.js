import html2canvas from "html2canvas";
import { clearChat, enableChat, shootChat } from "./chat";
import { getMySocket } from "./mySocket";
import {
    clearCanvas,
    disableCanvas,
    enableCanvas,
    getCanvasData,
} from "./paint";

const readyBtn = document.querySelector(".canvas__btn__ready");
const submitBtn = document.querySelector(".canvas__btn__submit");
const modifyBtn = document.querySelector(".canvas__btn__modify");
const helpContainer = document.querySelector(".help__container");
const modContainer = [
    document.querySelector(".mod0__container"),
    document.querySelector(".mod1__container"),
    document.querySelector(".mod2__container"),
];
const reviewContainer = document.querySelector(".review__container");
const prevBtn = document.querySelector(".review__btn__prev");
const nextBtn = document.querySelector(".review__btn__next");
const exitBtn = document.querySelector(".review__btn__exit");
const gameTimerDiv = document.querySelector(".canvas__timer");
const canvasShowDiv = document.querySelector(".canvas__show");
const downloadBtn = document.querySelector(".review__btn__download");

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
const TIMELIMIT = 60;

// 화면에 표시되는 타이머 숫자 변경 함수
const updateTimerDiv = (time) => {
    const span = gameTimerDiv.querySelector("span");
    span.innerHTML = time < 10 ? `0${time}` : time;
};

// 타이머 함수 (1초마다 반복)
const handleTimer = () => {
    timeRemaining--;
    updateTimerDiv(timeRemaining);
    if (timeRemaining === 0) {
        console.log("Timer End");
        handleGameSubmit[currMode].call(this);
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
    // 타이머 시간 최대로
    gameTimerDiv.querySelector("span").innerHTML =
        TIMELIMIT < 10 ? `0${TIMELIMIT}` : TIMELIMIT;
};

// 각 모드에 맞는 수정 버튼 핸들러
const handleGameSubmitModify = [
    // mod 0
    () => {
        const submitWord = modContainer[0].querySelector(".submitWord");
        const form = modContainer[0].querySelector("form");
        form.classList.remove("hidden");
        submitBtn.classList.remove("hidden");
        modifyBtn.classList.add("hidden");
        submitWord.classList.add("hidden");
        gameSubmit(null);
    },
    // mod 1
    () => {
        enableCanvas();
        submitBtn.classList.remove("hidden");
        modifyBtn.classList.add("hidden");
        gameSubmit(null);
    },
    // mod 2
    () => {
        const submitWord = modContainer[2].querySelector(".submitWord");
        const form = modContainer[2].querySelector("form");
        form.classList.remove("hidden");
        submitBtn.classList.remove("hidden");
        modifyBtn.classList.add("hidden");
        submitWord.classList.add("hidden");
        gameSubmit(null);
    },
];

// 각 모드에 맞는 Submit 핸들러
// 제출 버튼 또는 엔터키 이벤트 처리
const handleGameSubmit = [
    // mod 0
    (e) => {
        if (e) e.preventDefault();
        const submitWord = modContainer[0].querySelector(".submitWord");
        const form = modContainer[0].querySelector("form");
        const input = form.querySelector("input");
        const { value } = input;
        if (value !== "") {
            submitWord.querySelector(".word").innerHTML = value;
            form.classList.add("hidden");
            submitBtn.classList.add("hidden");
            modifyBtn.classList.remove("hidden");
            submitWord.classList.remove("hidden");
            gameSubmit(value);
        }
    },
    // mod 1
    (e) => {
        if (e) e.preventDefault();
        const drawingSVG = getCanvasData();
        disableCanvas();
        submitBtn.classList.add("hidden");
        modifyBtn.classList.remove("hidden");
        gameSubmit(drawingSVG);
    },
    // mod 2
    (e) => {
        if (e) e.preventDefault();
        const submitWord = modContainer[2].querySelector(".submitWord");
        const form = modContainer[2].querySelector("form");
        const input = form.querySelector("input");
        const { value } = input;
        if (value !== "") {
            submitWord.querySelector(".word").innerHTML = value;
            form.classList.add("hidden");
            submitBtn.classList.add("hidden");
            modifyBtn.classList.remove("hidden");
            submitWord.classList.remove("hidden");
            gameSubmit(value);
        } else {
            // 시간이 다되었으면 잔소리
            if (timeRemaining <= 0) {
                shootChat({ message:"제한 시간이 끝났습니다. 빨리 제출해주세요!", messageColor: "orange" });
            } else {
                shootChat({ message:"답을 적은 후 제출해주세요!", messageColor: "orange" });
            }
        }
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
        modifyBtn.classList.add("hidden");
        modifyBtn.removeEventListener("click", handleGameSubmitModify[0]);
        const submitWord = modContainer[0].querySelector(".submitWord");
        submitWord.classList.add("hidden");
    },
    // mod 1
    () => {
        modContainer[1].querySelector(".word").innerHTML = "";
        disableCanvas();
        clearCanvas();
        submitBtn.classList.remove("hidden");
        submitBtn.removeEventListener("click", handleGameSubmit[1]);
        modifyBtn.classList.add("hidden");
        modifyBtn.removeEventListener("click", handleGameSubmitModify[1]);
    },
    // mod 2
    () => {
        modContainer[2].querySelector(".word").innerHTML = "";
        const form = modContainer[2].querySelector("form");
        form.classList.remove("hidden");
        form.removeEventListener("submit", handleGameSubmit[2]);
        submitBtn.classList.remove("hidden");
        submitBtn.removeEventListener("click", handleGameSubmit[2]);
        modifyBtn.classList.add("hidden");
        modifyBtn.removeEventListener("click", handleGameSubmitModify[2]);
        const submitWord = modContainer[2].querySelector(".submitWord");
        submitWord.classList.add("hidden");
        canvasShowDiv.innerHTML = "";
    },
];

// currMode에 맞는 화면에 컨텐츠 배치 함수 배열
const activeMod = [
    // mod 0
    (word) => {
        modContainer[0].querySelector(".word").innerHTML = word;
        const form = modContainer[0].querySelector("form");
        form.addEventListener("submit", handleGameSubmit[0]);
        form.querySelector("input").value = word;
        if (!word.startsWith("자유 주제")) {
            form.querySelector("input").readOnly = true;
        }
        submitBtn.addEventListener("click", handleGameSubmit[0]);
        modifyBtn.addEventListener("click", handleGameSubmitModify[0]);
    },
    // mod 1
    (word) => {
        modContainer[1].querySelector(".word").innerHTML = word;
        enableCanvas();
        submitBtn.addEventListener("click", handleGameSubmit[1]);
        modifyBtn.addEventListener("click", handleGameSubmitModify[1]);
    },
    // mod 2
    (drawingSVG) => {
        canvasShowDiv.innerHTML = drawingSVG;
        const form = modContainer[2].querySelector("form");
        form.addEventListener("submit", handleGameSubmit[2]);
        form.querySelector("input").value = "";
        form.querySelector("input").readOnly = false;
        submitBtn.addEventListener("click", handleGameSubmit[2]);
        modifyBtn.addEventListener("click", handleGameSubmitModify[2]);
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
    modifyBtn.classList.add("hidden");
    helpContainer.classList.add("hidden");
    modContainer.map((element) => element.classList.add("hidden"));
    gameTimerDiv.classList.add("hidden");
    reviewContainer.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
    downloadBtn.addEventListener("click", handleDownload);
    // 방장인 경우에는 버튼 활성화
    if (getMySocket().leader) {
        prevBtn.classList.remove("hidden");
        prevBtn.addEventListener("click", handlePrevPage);
        nextBtn.classList.remove("hidden");
        nextBtn.addEventListener("click", handleNextPage);
        exitBtn.addEventListener("click", handleBackToLobby);
    }
    // 채팅 기능 활성화
    clearChat();
    enableChat(true);
};
const first = true;
// 리뷰 화면 컨텐츠 띄우기
const activeReview = (sketchBookOwner, sketchBookOwnerColor, myPage, data) => {
    // 초기화
    reviewContainer.innerHTML = "";

    // "닉네임"의 스케치북 - page N
    const reviewSpansDiv = document.createElement("div");
    reviewSpansDiv.className = "review__spans";
    const span1 = document.createElement("span");
    span1.className = "review__nickname";
    span1.innerHTML = sketchBookOwner;
    span1.style.color = sketchBookOwnerColor;
    const span2 = document.createElement("span");
    span2.innerHTML = "의 스케치북 - page";
    const span3 = document.createElement("span");
    span3.className = "review__page";
    span3.innerHTML = myPage + 1;
    reviewSpansDiv.appendChild(span1);
    reviewSpansDiv.appendChild(span2);
    reviewSpansDiv.appendChild(span3);
    reviewContainer.appendChild(reviewSpansDiv);
    // 그림 또는 제시어
    const dataDiv = document.createElement("div");
    dataDiv.className = "review__data";
    dataDiv.innerHTML = data;
    // 그림일 경우 overflow hidden, 글씨일 경우 scroll
    if ((myPage % 2 === 1)) {
        dataDiv.style.overflow = "hidden";
    } else {
        dataDiv.style.overflow = "scroll";
    }
    reviewContainer.appendChild(dataDiv);
};

const downloadURI = (uri, name) => {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

const handleDownload = (e) => {
    e.preventDefault();
    const imgDiv = document.querySelector(".review__data");
    let today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");
    const hour = today.getHours().toString().padStart(2, "0");
    const minute = today.getMinutes().toString().padStart(2, "0");
    const second = today.getSeconds().toString().padStart(2, "0");
    const imgName = `텔레스트레이션_${year}${month}${date}_${hour}${minute}${second}`;
    html2canvas(imgDiv).then((canvas) => {
        let image = canvas.toDataURL();
        downloadURI(image, imgName);
    });
}

// 게임 종료 후 View 초기화
const clearAllView = () => {
    deactiveMod.map((e) => e.call(this));
    modContainer.map((e) => e.classList.add("hidden"));
    reviewContainer.classList.add("hidden");
    helpContainer.classList.remove("hidden");
    submitBtn.classList.add("hidden");
    modifyBtn.classList.add("hidden");
    prevBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
    exitBtn.classList.add("hidden");
    readyBtn.classList.remove("hidden");
    gameTimerDiv.classList.add("hidden");
    downloadBtn.classList.add("hidden");
};

// 게임 시작 이벤트 처리
export const handleGameStart = ({ word, maxTurn }) => {
    inPlaying = true;
    gameTurn = 0;
    finalTurn = maxTurn;
    currMode = 0;
    selectMod(currMode, word);
    gameTimerDiv.classList.remove("hidden");
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
    submit = false;
    // 채팅 비활성화
    clearChat();
    enableChat(false);
    console.log("gameManager - gameStart!", word);
};

// 게임 초기화 이벤트 처리
export const handleTerminateGameNotif = ({}) => {
    clearInterval(timer);
    inPlaying = false;
    sketchBook = [];
    sketchBookPage = 0;
    finalPage = 0;
    currPage = -1;
    gameTurn = -1;
    finalTurn = -1;
    timer = null;
    timeRemaining = 0;
    currMode = -1;
    submit = false;
    // 모든 게임 화면 지우기
    clearAllView();
    // 채팅 활성화
    clearChat();
    enableChat(true);
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
    // 수정
    if (data === null) {
        console.log("수정");
        submit = false;
        getMySocket().emit(window.events.gameSubmit, { data: data, ready: submit });
    }
    // 제출
    else {
        console.log("제출");
        submit = true;
        getMySocket().emit(window.events.gameSubmit, { data: data, ready: submit });
    }
};

// 그릴 단어를 받았을 때
export const handleDrawThis = ({ word }) => {
    console.log("gameManager - handleDrawThis:", word);
    submit = false;
    selectMod(currMode, word);
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
};

// 맞출 단어를 받았을 때
export const handleGuessThis = ({ drawing }) => {
    console.log("gameManager - handleGuessThis");
    submit = false;
    selectMod(currMode, drawing);
    timeRemaining = TIMELIMIT;
    timer = setInterval(handleTimer, 1000);
};

// 리뷰창 페이지 업데이트하기
const pageUpdate = () => {
    if (sketchBook.length !== 0) {
        const myPage = currPage % sketchBookPage;
        if (myPage === 0) currMode = 0;
        else if (myPage % 2 === 1) currMode = 1;
        else currMode = 2;
        const player = Math.floor(currPage / sketchBookPage);
        const sketchBookOwner = sketchBook[player].nickname;
        const sketchBookOwnerColor = sketchBook[player].color;
        const data = sketchBook[player].history[myPage];
        // 리뷰화면 다시 그리기
        activeReview(sketchBookOwner, sketchBookOwnerColor, myPage, data);
        // 리더이고, 마지막 페이지인 경우 종료 버튼 활성화
        if (getMySocket().leader) {
            if (currPage === finalPage - 1) {
                nextBtn.classList.add("hidden");
                exitBtn.classList.remove("hidden");
            } else {
                nextBtn.classList.remove("hidden");
                exitBtn.classList.add("hidden");
            }
        }
        console.log("gameManager - pageUpdate:", sketchBookOwner, myPage);
    }
};

// 게임이 완료되었을 때 리뷰창으로 넘어가기
export const handleGameEnd = ({ finalSketchBook }) => {
    // 타이머 해제
    clearInterval(timer);
    inPlaying = false;
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

// 로비에서 나가기 버튼 이벤트 처리
const handleBackToLobby = (e) => {
    e.preventDefault();
    getMySocket().emit(window.events.terminateGame, {});
    console.log("gameManager - handleBackToLobby");
};
