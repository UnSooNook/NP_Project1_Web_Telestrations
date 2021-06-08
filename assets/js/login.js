import { shootChat } from "./chat";
import { initMySocket } from "./mySocket";

const loginContainer = document.querySelector(".login__container");
const mainContainer = document.querySelector(".main__container");
const loginForm = document.querySelector(".login__form");
const NICKNAME = "nickname";
// 내 닉네임
let nickname = localStorage.getItem(NICKNAME);

// 소캣에 닉네임 저장
const logIn = (nickname) => {
    // 소캣 생성
    const socket = io("/");
    // 서버에 등록
    socket.emit(window.events.logIn, { nickname });
    // 소캣 저장
    initMySocket(socket);
};

// 새 플레이어 로그인 시 채팅 알림
export const handleHelloPlayer = ({ nickname }) => {
    shootChat(`${nickname} just joined!`, "white");
};

// 플레이어 로그아웃 시 채팅 알림
export const handleByePlayer = ({ nickname }) => {
    shootChat(`${nickname} just left!`, "red");
};

// 닉네임 입력 후 엔터 이벤트 핸들러
const handleLoginSubmit = (e) => {
    e.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    input.value = "";
    // 닉네임 Local Storage에 저장
    localStorage.setItem(NICKNAME, value);

    initLogin();
};

// 로그인 Container 초기화
const initLogin = () => {
    // Local Storage에서 닉네임 불러오기
    nickname = localStorage.getItem(NICKNAME);
    console.log(`nickname: ${nickname}`);

    // 닉네임 설정이 되어 있는 경우 로비화면
    if (nickname === null) {
        // 닉네임 설정이 되어 있지 않은 경우 로그인 화면
        loginForm.addEventListener("submit", handleLoginSubmit);
    } else {
        loginForm.removeEventListener("submit", handleLoginSubmit);
        loginContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        logIn(nickname);
    }
};

initLogin();
