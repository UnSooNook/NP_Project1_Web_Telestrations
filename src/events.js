// 이벤트 이름 저장소
const events = {
    updatePlayer: "updatePlayer",
    logIn: "logIn",
    helloPlayer: "helloPlayer",
    logOut: "disconnect",
    byePlayer: "byePlayer",
    sendMessage: "sendMessage",
    newMessage: "newMessage",
    leaderNotif: "leaderNotif",
    leaderConfirm: "leaderConfirm",
    lobbyReady: "lobbyReady",

    // 그리기 시작(나)
    beginPath: "beginPath",
    // 그리기(나)
    strokePath: "strokePath",
    // 그리기 시작 알리기
    beganPath: "beganPath",
    // 그리기 알리기
    strokedPath: "strokedPath",
    // 채우기(나)
    fill: "fill",
    // 채우기 알리기
    filled: "filled",
};

export default events;
