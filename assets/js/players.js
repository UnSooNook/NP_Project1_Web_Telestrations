import { isPlaying } from "./gameManager";
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
    // 업데이트 된 정보에 맞게 플레이어 리스트 그리기
    playersDiv.innerHTML = "";
    sockets.map((socket) => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "players";
        const isLeader = document.createElement("i");
        isLeader.classList.add("fas");
        if ((isPlaying() === false) && (socket.leader)) {
            isLeader.classList.add("fa-crown");
            isLeader.style.color = "orange";
        } else if (socket.ready) {
            isLeader.classList.add("fa-check");
            isLeader.style.color = "green";
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
    if (newMe) {
        // 자신에 준비상태에 맞게 준비 버튼 글자 변경
        if (!newMe.leader) {
            if (newMe.ready) {
                readyBtn.innerHTML = "준비 취소";
            } else {
                readyBtn.innerHTML = "준비";
            }
        } else {
            // 방장인 경우 준비 버튼을 게임 시작 버튼 으로
            readyBtn.innerHTML = "게임 시작";
        }
    }
    updateMySocket(newMe);
};

// 내가 방장으로 업데이트
export const handleLeaderNotif = ({}) => {
    let me = getMySocket();
    me.leader = true;
    console.log(me.nickname);
    me.emit(window.events.leaderConfirm, {});
    updateMySocket(me);
    console.log("players - leaderNotif", me.leader);
};

// 로비창에서 준비버튼을 눌렀을 때 이벤트 리스너
const handleLobbyReady = (e) => {
    e.preventDefault();
    const me = getMySocket();
    me.ready = !me.ready;
    if (!me.leader) {
        if (me.ready) {
            console.log("준비 완료 >>> 대기");
        } else {
            console.log("대기 >>> 준비 완료");
        }
    }
    me.emit(window.events.lobbyReady, { ready: me.ready });
    updateMySocket(me);
};

if (readyBtn) {
    readyBtn.addEventListener("click", handleLobbyReady);
}
