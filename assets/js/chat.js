import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

// 메시지 받기 이벤트 처리
const appendMsg = (text, nickname) => {
    const li = document.createElement("li");
    // 채팅 색을 다르게
    li.innerHTML = `
    <span class="author ${nickname ? "out" : "self"}">${
        nickname ? nickname : "You"
    }:</span> ${text}
    `;
    messages.appendChild(li);
};

// 메시지 보내기 이벤트 처리
const handleSendMsg = (event) => {
    event.preventDefault();
    const input = sendMsg.querySelector("input");
    const { value } = input;
    // 소캣에 메시지 보내기 이벤트 발생시키기
    getSocket().emit(window.events.sendMsg, { message: value });
    input.value = "";
    appendMsg(value);
};

// 메시지 알리기 이벤트 처리
export const handleNewMessage = ({ message, nickname }) => {
    appendMsg(message, nickname);
};

// 메시지 보내기 이벤트 처리
if (sendMsg) {
    sendMsg.addEventListener("submit", handleSendMsg);
}

export const disableChat = () => {
    sendMsg.style.display = "none";
};

export const enableChat = () => {
    sendMsg.style.display = "flex";
};