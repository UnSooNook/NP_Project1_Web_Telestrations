import { getMySocket, updateMySocket } from "./mySocket";

const readyBtn = document.querySelector(".canvas__btn__ready");

// 플레이어 정보 업데이트
export const handleUpdatePlayer = ({ sockets }) => {
    // 내 정보 업데이트
    const me = getMySocket();
    const newMe = sockets.find((socket) => {
        if (socket.id === me.id) return true;
    });
    updateMySocket(newMe);
    // TODO: 화면 업데이트 (방장, 레디, 플레이어 수 등)
};

// 내가 방장으로 업데이트
export const handleLeaderNotif = ({}) => {
    let me = getMySocket();
    me.leader = true;
    me.emit(window.events.leaderConfirm, {});
    updateMySocket(me);
    console.log("players - leaderNotif", me.leader);

    me.emit(window.events.sendMessage, { message: "방장이 되었습니다." });
};

// 로비창에서 준비버튼을 눌렀을 때 이벤트 리스너
const handleLobbyReady = (e) => {
    e.preventDefault();
    const me = getMySocket();
    if (me.ready) {
        me.ready = false;
        console.log("준비 완료 -> 대기");
        readyBtn.innerHTML = "준비";
    } else {
        me.ready = true;
        console.log("대기 -> 준비 완료");
        readyBtn.innerHTML = "준비 완료";
    }
    me.emit(window.events.lobbyReady, { ready: me.ready });
    updateMySocket(me);
};

if (readyBtn) {
    readyBtn.addEventListener("click", handleLobbyReady);
}
