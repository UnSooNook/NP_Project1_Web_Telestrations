import { getMySocket, updateMySocket } from "./mySocket";

const readyBtn = document.querySelector(".canvas__btn__ready");
const playersDiv = document.querySelector(".chat__players__div");

// 플레이어 정보 업데이트
export const handleUpdatePlayer = ({ sockets }) => {
    // 내 정보 업데이트
    const me = getMySocket();
    const newMe = sockets.find((socket) => {
        if (socket.id === me.id) return true;
    });

    playersDiv.innerHTML = "";
    sockets.map((socket) => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "players";
        const isLeader = document.createElement("span");
        if (socket.leader) {
            isLeader.innerHTML = "방장";
        } else if (socket.ready) {
            isLeader.innerHTML = "준비";
        }
        const nameDiv = document.createElement("div");
        if (socket.nickname.length === 1)
            nameDiv.innerHTML = socket.nickname[0];
        else nameDiv.innerHTML = socket.nickname[0] + socket.nickname[1];
        nameDiv.style.backgroundColor = socket.color;
        playerDiv.appendChild(isLeader);
        playerDiv.appendChild(nameDiv);
        playersDiv.appendChild(playerDiv);
    });
    updateMySocket(newMe);
};

// 내가 방장으로 업데이트
export const handleLeaderNotif = ({}) => {
    let me = getMySocket();
    me.leader = true;
    console.log(me.nickname);
    me.emit(window.events.leaderConfirm, {});
    updateMySocket(me);
    readyBtn.innerHTML = "게임 시작";
    console.log("players - leaderNotif", me.leader);
};

// 로비창에서 준비버튼을 눌렀을 때 이벤트 리스너
const handleLobbyReady = (e) => {
    e.preventDefault();
    const me = getMySocket();
    if (me.ready) {
        me.ready = false;
        console.log("준비 완료 >>> 대기");
        readyBtn.innerHTML = "준비";
    } else {
        me.ready = true;
        console.log("대기 >>> 준비 완료");
        readyBtn.innerHTML = "준비 취소";
    }
    me.emit(window.events.lobbyReady, { ready: me.ready });
    updateMySocket(me);
};

if (readyBtn) {
    readyBtn.addEventListener("click", handleLobbyReady);
}
