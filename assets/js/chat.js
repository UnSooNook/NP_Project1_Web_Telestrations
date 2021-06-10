import { getMySocket } from "./mySocket";

const chatForm = document.querySelector(".chat__form");
const chatListView = document.querySelector(".chat__view__div");

// 채팅 띄우기
export const shootChat = ({ name, nameColor, message, messageColor }) => {
    const messageDiv = document.createElement("div");
    const nickname = document.createElement("span");
    const chat = document.createElement("p");
    messageDiv.className = "messages";
    // name이 있는 경우 (name: message) 형식
    if (name) {
        nickname.innerText = `${name}: `;
        nickname.style.color = nameColor;
        messageDiv.append(nickname);
    }
    // name이 없는 경우 (message) 형식
    chat.innerText = `${message}`;
    chat.style.color = messageColor;
    messageDiv.append(chat);
    chatListView.appendChild(messageDiv);
};

// 플레이어가 보낸 메시지 처리
export const handleNewMessage = ({ name, nameColor, message, messageColor }) => {
    shootChat({ name, nameColor, message, messageColor });
    console.log("handleNewMessage", `${name}: ${message}`);
};

// 서버가 보낸 메시지 처리
export const handleServerMessage = ({ message, messageColor }) => {
    shootChat({ message, messageColor });
    console.log("handleServerMessage", `[SERVER] ${message}`);
};

// 채팅 입력후 엔터키 이벤트 리스너
const handleSendMessage = (e) => {
    e.preventDefault();
    const input = chatForm.querySelector("input");
    const { value } = input;
    const me = getMySocket();
    me.emit(window.events.sendMessage, { message: value });
    shootChat({ name: me.nickname, nameColor: me.color, message: value });
    input.value = "";
    console.log("handleSendMessage", value);
};

if (chatForm) chatForm.addEventListener("submit", handleSendMessage);
