import { getSocket } from "./sockets";

const chatForm = document.querySelector(".chat__form");
const chatListView = document.querySelector(".chat__view__div");

// 채팅 띄우기
export const shootChat = (text, color) => {
    const chat = document.createElement("p");
    chat.innerText = text;
    chat.style.color = color;
    chatListView.appendChild(chat);
};

// 채팅 이벤트 처리
export const handleChat = ({ nickname, chats }) => {
    shootChat(`${nickname}: ${chats}`, "white");
};

const handleSubmintChat = (e) => {
    e.preventDefault();
    const input = chatForm.querySelector("input");
    const { value } = input;
    input.value = "";
    console.log(value);

    const socket = getSocket();
    socket.emit(window.events.sendChat, { chats: value });
};

const initChat = () => {
    chatForm.addEventListener("submit", handleSubmintChat);
};

initChat();
