import { getSocket } from "./sockets";

const chatForm = document.querySelector(".chat__form");

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
