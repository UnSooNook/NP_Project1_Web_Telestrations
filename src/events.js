// 이벤트 이름 저장소
const events = {
    // 닉네임 설정(나)
    setNickname: "setNickname",
    // 로그인 알리기
    newUser: "newUser",
    // 로그아웃(나)
    disconnect: "disconnect",
    // 로그아웃 알리기
    disconnected: "disconnected",
    // 메시지 보내기(나)
    sendMsg: "sendMsg",
    // 메시지 알리기
    newMsg: "newMsg",
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
    // 
    playerUpdate: "playerUpdate"
};

export default events;