import { getMySocket } from "./mySocket";

const chatForm = document.querySelector(".chat__form");
const chatListView = document.querySelector(".chat__view__div");

// // 메시지 받기 이벤트 처리
// const appendMsg = (text, nickname) => {
//     const li = document.createElement("li");
//     // 채팅 색을 다르게
//     li.innerHTML = `
//     <span class="author ${nickname === getMySocket().nickname ? "self" : "out"}">${
//         nickname === getMySocket().nickname ? "You" : nickname
//     }:</span> ${text}
//     `;
//     messages.appendChild(li);
// };

// 채팅 띄우기
export const shootChat = (text, color) => {
    const chat = document.createElement("p");
    chat.innerText = text;
    chat.style.color = color;
    chatListView.appendChild(chat);
    console.log("shootChat", text);
};

// 플레이어가 보낸 메시지 처리
export const handleNewMessage = ({ nickname, message }) => {
	shootChat(`${nickname}: ${message}`, "white");
    console.log("handleNewMessage", `${nickname}: ${message}`);
};

// 내가 보낸 메시지 이벤트 리스너
const handleSendMessage = (e) => {
	e.preventDefault();
    const input = chatForm.querySelector("input");
    const { value } = input;
	getMySocket().emit(window.events.sendMessage, { message: value });
    input.value = "";
    console.log("handleSendMessage", value);
};

// // 메시지 보내기 이벤트 처리
// if (sendMsg) {
//     sendMsg.addEventListener("submit", handleSendMessage);
// }

if (chatForm)
        chatForm.addEventListener("submit", handleSendMessage);
