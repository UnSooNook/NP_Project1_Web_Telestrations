import { getMySocket } from "./mySocket";

const chatForm = document.querySelector(".chat__form");
const chatListView = document.querySelector(".chat__view__div");

// 채팅 띄우기
export const shootChat = (text, color) => {
    const chat = document.createElement("p");
    chat.innerText = text;
    chat.style.color = color;
    chatListView.appendChild(chat);
};

// 채팅 소켓 이벤트 핸들러
export const handleNewMessage = ({ nickname, message }) => {
    shootChat(`${nickname}: ${message}`, "white");
};

// 채팅 입력 후 엔터 키 이벤트 핸들러
const handleSubmintChat = (e) => {
    e.preventDefault();
    const input = chatForm.querySelector("input");
    const { value } = input;
    input.value = "";
    const socket = getMySocket();
    socket.emit(window.events.sendMessage, { message: value });
};

// 채팅 Container 초기화
const initChat = () => {
    chatForm.addEventListener("submit", handleSubmintChat);
};

initChat();
