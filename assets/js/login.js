import { initSockets } from "./sockets";

const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

// Local Storage에서 닉네임 불러오기
const nickname = localStorage.getItem(NICKNAME);

// 소캣에 닉네임 저장
export const logIn = (nickname) => {
    // 소캣 생성 및 연결
    const socket = io("/");
    // 소캣에 닉네임 저장
    socket.emit(window.events.setNickname, { nickname });
    // 소캣 저장
    initSockets(socket);
};

// 창 설정 (로그인 창 / 게임 창)
if (nickname === null) {
    body.className = LOGGED_OUT;
} else {
    body.className = LOGGED_IN;
    logIn(nickname);
}

// 로그인 창 - 로그인 이벤트 처리
const handleFormSubmit = (e) => {
    e.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    input.value = "";
    // 닉네임 Local Storage에 저장
    localStorage.setItem(NICKNAME, value);
    body.className = LOGGED_IN;
    logIn(value);
};

// 로그인 창 - 이벤트리스너
if (loginForm) {
    loginForm.addEventListener("submit", handleFormSubmit);
}