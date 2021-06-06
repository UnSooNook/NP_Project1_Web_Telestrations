const chatListView = document.querySelector(".chat__view__div");

// 알림
const shootChat = (text, color) => {
    const chat = document.createElement("p");
    chat.innerText = text;
    chat.style.color = color;
    chatListView.appendChild(chat);
};

// 새 유저 로그인 이벤트 처리
export const handleNewUser = ({ nickname }) => {
    shootChat(`${nickname} just joined!`, "white");
};

// 유저 로그아웃 이벤트 처리
export const handleDisconnected = ({ nickname }) => {
    shootChat(`${nickname} just left!`, "red");
};

// 채팅 이벤트 처리
export const handleChat = ({ nickname, chats }) => {
    shootChat(`${nickname}: ${chats}`, "white");
};
