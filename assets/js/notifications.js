const body = document.querySelector("body");

// 알림
const fireNotification = (text, color) => {
    const notification = document.createElement("div");
    notification.innerText = text;
    notification.style.backgroundColor = color;
    notification.className = "notification";
    body.appendChild(notification);
};

// 새 유저 로그인 이벤트 처리
export const handleNewUser = ({ nickname }) => {
    // console.log(nickname, " just joined");
    fireNotification(`${nickname} just joined!`, "rgb(0, 122, 255)");
};

// 유저 로그아웃 이벤트 처리
export const handleDisconnected = ({ nickname }) => {
    // console.log(nickname, " just left");
    fireNotification(`${nickname} just left!`, "rgb(255, 149, 0)");
};