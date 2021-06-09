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
export const shootChat = ({ name, nameColor, message, messageColor }) => {
    const messageDiv = document.createElement("div");
    const nickname = document.createElement("span");
    const chat = document.createElement("p");

    messageDiv.className = "messages";
    if (name) {
        nickname.innerText = `${name}: `;
        nickname.style.color = nameColor;
        messageDiv.append(nickname);
    }
    chat.innerText = `${message}`;
    chat.style.color = messageColor;
    messageDiv.append(chat);

    chatListView.appendChild(messageDiv);
};

// 플레이어가 보낸 메시지 처리
export const handleNewMessage = ({
    name,
    nameColor,
    message,
    messageColor,
}) => {
    shootChat({
        name,
        nameColor,
        message,
        messageColor,
    });
    console.log("handleNewMessage", `${name}: ${message}`);
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

if (chatForm) chatForm.addEventListener("submit", handleSendMessage);
