import { shootChat } from "./chat";
import { initSockets } from "./sockets";

const loginContainer = document.querySelector(".login__container");
const mainContainer = document.querySelector(".main__container");
const loginForm = document.querySelector(".login__form");
const NICKNAME = "nickname";
var nickname = null;

// 소캣에 닉네임 저장
const logIn = (nickname) => {
    // 소캣 생성 및 연결
    const socket = io("/");
    // 소캣에 닉네임 저장
    socket.emit(window.events.login, { nickname });
    // 소캣 저장
    initSockets(socket);
};

// 새 유저 로그인 이벤트 처리
export const handleNewUser = ({ nickname }) => {
    shootChat(`${nickname} just joined!`, "white");
};

// 유저 로그아웃 이벤트 처리
export const handleDisconnected = ({ nickname }) => {
    shootChat(`${nickname} just left!`, "red");
};

// 닉네임 설정 이벤트 핸들러
const handleLoginSubmit = (e) => {
    e.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    input.value = "";
    // 닉네임 Local Storage에 저장
    localStorage.setItem(NICKNAME, value);

    initLogin();
};

const initLogin = () => {
    // Local Storage에서 닉네임 불러오기
    nickname = localStorage.getItem(NICKNAME);
    console.log(`nickname: ${nickname}`);

    if (nickname) {
        loginForm.removeEventListener("submit", handleLoginSubmit);
        loginContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        logIn(nickname);
    } else {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
};

initLogin();
