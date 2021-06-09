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

const handleLogInSubmit = (e) => {
	e.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    input.value = "";
    // 닉네임 Local Storage에 저장
    localStorage.setItem(NICKNAME, value);
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    nickname = value;

	logIn(nickname);
};

// 창 설정 (로그인 창 / 게임 창)
if (nickname === null) {
    loginContainer.classList.remove("hidden");
    mainContainer.classList.add("hidden");
} else {
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
    logIn(nickname);
}
// 로그인 창 - 이벤트리스너
if (loginForm) {
    loginForm.addEventListener("submit", handleLogInSubmit);
}