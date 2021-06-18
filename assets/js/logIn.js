import { shootChat } from "./chat";
import { initMySocket } from "./mySocket";

const loginContainer = document.querySelector(".login__container");
const mainContainer = document.querySelector(".main__container");
const loginForm = document.querySelector(".login__form");
const NICKNAME = "nickname";
// 내 닉네임 가져오기
let nickname = localStorage.getItem(NICKNAME);

// 로그인 화면을 숨기고 메인 화면 띄우기
const enableMainView = () => {
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
};

// 메인 화면을 숨기고 로그인 화면 띄우기
const disableMainView = () => {
    loginContainer.classList.remove("hidden");
    mainContainer.classList.add("hidden");
};

// 새로 로그인했거나 이미 nickname 정보가 있을 경우
const logIn = (nickname) => {
    // 소캣 생성
    const socket = io("/");
    // 서버에 등록
    socket.emit(window.events.logIn, { nickname });
    // 소캣 이벤트 리스너 추가
    initMySocket(socket);
};

const handleLogInSubmit = (e) => {
    e.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    value = value.replace(" ", "");
    input.value = "";
    // 닉네임 Local Storage에 저장
    localStorage.setItem(NICKNAME, value);
    // 메인 화면 띄우기
    enableMainView();
    nickname = value;

    logIn(nickname);
};

// 새 플레이어 로그인 시 채팅 알림
export const handleHelloPlayer = ({ nickname }) => {
    if (nickname) {
        shootChat({
            message: `${nickname}님이 입장하였습니다.`,
            messageColor: "green",
        });
        console.log("[SERVER] Hello,", nickname);
    }
};

// 플레이어 로그아웃 시 채팅 알림
export const handleByePlayer = ({ nickname }) => {
    if (nickname) {
        shootChat({
            message: `${nickname}님이 나갔습니다.`,
            messageColor: "lightBlue",
        });
        console.log("[SERVER] Bye,", nickname);
    }
};

// 창 설정 (로그인 창 / 게임 창)
if (nickname === null) {
    disableMainView();
} else {
    enableMainView();
    logIn(nickname);
}
// 로그인 창 - 이벤트리스너
if (loginForm) {
    loginForm.addEventListener("submit", handleLogInSubmit);
}
