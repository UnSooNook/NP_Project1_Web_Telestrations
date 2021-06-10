(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleServerMessage=exports.handleNewMessage=exports.shootChat=exports.clearChat=exports.enableChat=void 0;var _mySocket=require("./mySocket"),chatForm=document.querySelector(".chat__form"),chatListView=document.querySelector(".chat__view__div"),enableChat=function(e){var a=chatForm.querySelector("input");a.value="",e?(a.disabled=!1,a.placeholder="메시지 입력"):(a.disabled=!0,a.placeholder="지금은 채팅을 할 수 없습니다.")};exports.enableChat=enableChat;var clearChat=function(){chatListView.innerHTML=""};exports.clearChat=clearChat;var shootChat=function(e){var a=e.name,o=e.nameColor,t=e.message,s=e.messageColor,r=document.createElement("div"),n=document.createElement("span"),l=document.createElement("p");r.className="messages",a&&(n.innerText="".concat(a,": "),n.style.color=o,r.append(n)),l.innerText="".concat(t),l.style.color=s,r.append(l),chatListView.appendChild(r)};exports.shootChat=shootChat;var handleNewMessage=function(e){var a=e.name,o=e.nameColor,t=e.message,s=e.messageColor;shootChat({name:a,nameColor:o,message:t,messageColor:s}),console.log("handleNewMessage","".concat(a,": ").concat(t))};exports.handleNewMessage=handleNewMessage;var handleServerMessage=function(e){var a=e.message,o=e.messageColor;shootChat({message:a,messageColor:o}),console.log("handleServerMessage","[SERVER] ".concat(a))};exports.handleServerMessage=handleServerMessage;var handleSendMessage=function(e){e.preventDefault();var a=chatForm.querySelector("input"),o=a.value;if(""!==o){var t=(0,_mySocket.getMySocket)();t.emit(window.events.sendMessage,{message:o}),shootChat({name:t.nickname,nameColor:t.color,message:o}),a.value="",console.log("handleSendMessage",o)}};chatForm&&chatForm.addEventListener("submit",handleSendMessage);

},{"./mySocket":5}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleNextPage=exports.handlePrevPage=exports.handleUpdatePage=exports.handleGameEnd=exports.handleGuessThis=exports.handleDrawThis=exports.handleNextTurn=exports.handleTerminateGameNotif=exports.handleGameStart=void 0;var _chat=require("./chat"),_mySocket=require("./mySocket"),_this=void 0;function _objectDestructuringEmpty(e){if(null==e)throw new TypeError("Cannot destructure undefined")}var readyBtn=document.querySelector(".canvas__btn__ready"),submitBtn=document.querySelector(".canvas__btn__submit"),modifyBtn=document.querySelector(".canvas__btn__modify"),helpContainer=document.querySelector(".help__container"),modContainer=[document.querySelector(".mod0__container"),document.querySelector(".mod1__container"),document.querySelector(".mod2__container")],reviewContainer=document.querySelector(".review__container"),prevBtn=document.querySelector(".review__btn__prev"),nextBtn=document.querySelector(".review__btn__next"),exitBtn=document.querySelector(".review__btn__exit"),inPlaying=!1,sketchBook=[],sketchBookPage=0,finalPage=0,currPage=-1,gameTurn=-1,finalTurn=-1,timer=null,timeRemaining=0,currMode=-1,submit=!1,TIMELIMIT=30,handleTimer=function(){timeRemaining--,console.log("timer:",timeRemaining),0===timeRemaining&&(console.log("Time Expired"),gameSubmit(),clearInterval(timer))},enableModView=function(e){readyBtn.classList.add("hidden"),helpContainer.classList.add("hidden"),submitBtn.classList.remove("hidden"),modContainer.map(function(e){return e.classList.add("hidden")}),modContainer[e].classList.remove("hidden")},handleGameSubmitModify=[function(){var e=modContainer[0].querySelector(".submitWord");modContainer[0].querySelector("form").classList.remove("hidden"),submitBtn.classList.remove("hidden"),modifyBtn.classList.add("hidden"),e.classList.add("hidden")},function(){submitBtn.classList.remove("hidden"),modifyBtn.classList.add("hidden")},function(){var e=modContainer[2].querySelector(".submitWord");modContainer[2].querySelector("form").classList.remove("hidden"),submitBtn.classList.remove("hidden"),modifyBtn.classList.add("hidden"),e.classList.add("hidden")}],handleGameSubmit=[function(e){e.preventDefault();var t=modContainer[0].querySelector(".submitWord"),n=modContainer[0].querySelector("form"),a=n.querySelector("input").value;""!==a&&(t.querySelector(".word").innerHTML=a,n.classList.add("hidden"),submitBtn.classList.add("hidden"),modifyBtn.classList.remove("hidden"),t.classList.remove("hidden"),gameSubmit(a))},function(e){e.preventDefault();submitBtn.classList.add("hidden"),modifyBtn.classList.remove("hidden"),gameSubmit("그림")},function(e){e.preventDefault();var t=modContainer[2].querySelector(".submitWord"),n=modContainer[2].querySelector("form"),a=n.querySelector("input").value;""!==a&&(t.querySelector(".word").innerHTML=a,n.classList.add("hidden"),submitBtn.classList.add("hidden"),modifyBtn.classList.remove("hidden"),t.classList.remove("hidden"),gameSubmit(a))}],deactiveMod=[function(){modContainer[0].querySelectorAll(".word").forEach(function(e){return e.innerHTML=""});var e=modContainer[0].querySelector("form");e.classList.remove("hidden"),e.removeEventListener("submit",handleGameSubmit[0]),submitBtn.classList.remove("hidden"),submitBtn.removeEventListener("click",handleGameSubmit[0]),modifyBtn.classList.add("hidden"),modifyBtn.removeEventListener("click",handleGameSubmitModify[0]),modContainer[0].querySelector(".submitWord").classList.add("hidden")},function(){modContainer[1].querySelector(".word").innerHTML="",submitBtn.classList.remove("hidden"),submitBtn.removeEventListener("click",handleGameSubmit[1]),modifyBtn.classList.add("hidden"),modifyBtn.removeEventListener("click",handleGameSubmitModify[1])},function(){modContainer[2].querySelector(".word").innerHTML="";var e=modContainer[2].querySelector("form");e.classList.remove("hidden"),e.removeEventListener("submit",handleGameSubmit[2]),submitBtn.classList.remove("hidden"),submitBtn.removeEventListener("click",handleGameSubmit[2]),modifyBtn.classList.add("hidden"),modifyBtn.removeEventListener("click",handleGameSubmitModify[2]),modContainer[2].querySelector(".submitWord").classList.add("hidden")}],activeMod=[function(e){modContainer[0].querySelector(".word").innerHTML=e;var t=modContainer[0].querySelector("form");t.addEventListener("submit",handleGameSubmit[0]),t.querySelector("input").value=e,submitBtn.addEventListener("click",handleGameSubmit[0]),modifyBtn.addEventListener("click",handleGameSubmitModify[0])},function(e){modContainer[1].querySelector(".word").innerHTML=e,submitBtn.addEventListener("click",handleGameSubmit[1]),modifyBtn.addEventListener("click",handleGameSubmitModify[1])},function(e){modContainer[2].querySelector("form").addEventListener("submit",handleGameSubmit[2]),submitBtn.addEventListener("click",handleGameSubmit[2]),modifyBtn.addEventListener("click",handleGameSubmitModify[2])}],selectMod=function(e,t){deactiveMod.map(function(e){return e.call(_this)}),enableModView(e),activeMod[e].call(_this,t)},enableReviewView=function(){readyBtn.classList.add("hidden"),submitBtn.classList.add("hidden"),modifyBtn.classList.add("hidden"),helpContainer.classList.add("hidden"),modContainer.map(function(e){return e.classList.add("hidden")}),reviewContainer.classList.remove("hidden"),(0,_mySocket.getMySocket)().leader&&(prevBtn.classList.remove("hidden"),prevBtn.addEventListener("click",handlePrevPage),nextBtn.classList.remove("hidden"),nextBtn.addEventListener("click",handleNextPage),exitBtn.addEventListener("click",handleBackToLobby)),(0,_chat.clearChat)(),(0,_chat.enableChat)(!0)},activeReview=function(e){reviewContainer.innerHTML=e},clearAllView=function(){deactiveMod.map(function(e){return e.call(_this)}),modContainer.map(function(e){return e.classList.add("hidden")}),reviewContainer.classList.add("hidden"),helpContainer.classList.remove("hidden"),submitBtn.classList.add("hidden"),modifyBtn.classList.add("hidden"),prevBtn.classList.add("hidden"),nextBtn.classList.add("hidden"),exitBtn.classList.add("hidden"),readyBtn.classList.remove("hidden")},handleGameStart=function(e){var t=e.word,n=e.maxTurn;inPlaying=!0,gameTurn=0,finalTurn=n,selectMod(currMode=0,t),timeRemaining=TIMELIMIT,timer=setInterval(handleTimer,1e3),(0,_chat.clearChat)(),(0,_chat.enableChat)(!1),console.log("gameManager - gameStart!",t)};exports.handleGameStart=handleGameStart;var handleTerminateGameNotif=function(e){_objectDestructuringEmpty(e),clearInterval(timer),inPlaying=!1,sketchBook=[],sketchBookPage=0,finalPage=0,currPage=-1,gameTurn=-1,finalTurn=-1,timer=null,timeRemaining=0,currMode=-1,submit=!1,clearAllView(),(0,_chat.clearChat)(),(0,_chat.enableChat)(!0),console.log("gameManager - terminateGame..")};exports.handleTerminateGameNotif=handleTerminateGameNotif;var handleNextTurn=function(e){var t=e.currTurn;clearInterval(timer),gameTurn=t,t%2==1?(currMode=1,(0,_mySocket.getMySocket)().emit(window.events.letMeDraw,{})):(currMode=2,(0,_mySocket.getMySocket)().emit(window.events.letMeGuess,{})),console.log("gameManager - handleNextTurn",gameTurn)};exports.handleNextTurn=handleNextTurn;var gameSubmit=function(e){0===currMode?console.log("gameManager - handleGameSubmit 제시어 제출"):1===currMode?(console.log("gameManager - handleGameSubmit 그리기 제출"),e="".concat((0,_mySocket.getMySocket)().nickname,"'s 그림")):console.log("gameManager - handleGameSubmit 맞추기 제출"),(0,_mySocket.getMySocket)().emit(window.events.gameSubmit,{data:e}),submit=!0},handleDrawThis=function(e){var t=e.word;console.log("gameManager - handleDrawThis:",t),selectMod(currMode,t),timeRemaining=TIMELIMIT,timer=setInterval(handleTimer,1e3)};exports.handleDrawThis=handleDrawThis;var handleGuessThis=function(e){var t=e.drawing;console.log("gameManager - handleGuessThis:",t),selectMod(currMode,t),timeRemaining=TIMELIMIT,timer=setInterval(handleTimer,1e3)};exports.handleGuessThis=handleGuessThis;var pageUpdate=function(){var e=currPage%sketchBookPage;currMode=0===e?0:e%2==1?1:2;var t=Math.floor(currPage/sketchBookPage),n=sketchBook[t].nickname,a=sketchBook[t].history[e];activeReview(a),(0,_mySocket.getMySocket)().leader&&(currPage===finalPage-1?(nextBtn.classList.add("hidden"),exitBtn.classList.remove("hidden")):(nextBtn.classList.remove("hidden"),exitBtn.classList.add("hidden"))),console.log("gameManager - pageUpdate:",n,e,a)},handleGameEnd=function(e){var t=e.finalSketchBook;clearInterval(timer),inPlaying=!1,sketchBook=t,sketchBookPage=t[0].history.length,finalPage=t.length*t[0].history.length,currPage=0,(0,_mySocket.getMySocket)().leader&&(0,_mySocket.getMySocket)().emit(window.events.updatePageNum,{newPage:currPage}),enableReviewView()};exports.handleGameEnd=handleGameEnd;var handleUpdatePage=function(e){var t=e.newPage;currPage=t,console.log("gameManager - handlePageUpdate",currPage),pageUpdate()};exports.handleUpdatePage=handleUpdatePage;var handlePrevPage=function(e){e.preventDefault(),0!==currPage&&(currPage--,(0,_mySocket.getMySocket)().emit(window.events.updatePageNum,{newPage:currPage}))};exports.handlePrevPage=handlePrevPage;var handleNextPage=function(e){e.preventDefault(),currPage!==finalPage-1&&(currPage++,(0,_mySocket.getMySocket)().emit(window.events.updatePageNum,{newPage:currPage}))};exports.handleNextPage=handleNextPage;var handleBackToLobby=function(e){e.preventDefault(),(0,_mySocket.getMySocket)().emit(window.events.terminateGame,{}),console.log("gameManager - handleBackToLobby")};

},{"./chat":1,"./mySocket":5}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleByePlayer=exports.handleHelloPlayer=void 0;var _chat=require("./chat"),_mySocket=require("./mySocket"),loginContainer=document.querySelector(".login__container"),mainContainer=document.querySelector(".main__container"),loginForm=document.querySelector(".login__form"),NICKNAME="nickname",nickname=localStorage.getItem(NICKNAME),enableMainView=function(){loginContainer.classList.add("hidden"),mainContainer.classList.remove("hidden")},disableMainView=function(){loginContainer.classList.remove("hidden"),mainContainer.classList.add("hidden")},logIn=function(e){var n=io("/");n.emit(window.events.logIn,{nickname:e}),(0,_mySocket.initMySocket)(n)},handleLogInSubmit=function(e){e.preventDefault();var n=loginForm.querySelector("input"),o=n.value;n.value="",localStorage.setItem(NICKNAME,o),enableMainView(),logIn(nickname=o)},handleHelloPlayer=function(e){var n=e.nickname;n&&((0,_chat.shootChat)({message:"".concat(n,"님이 입장하였습니다."),messageColor:"green"}),console.log("[SERVER] Hello,",n))};exports.handleHelloPlayer=handleHelloPlayer;var handleByePlayer=function(e){var n=e.nickname;n&&((0,_chat.shootChat)({message:"".concat(n,"님이 나갔습니다."),messageColor:"green"}),console.log("[SERVER] Bye,",n))};exports.handleByePlayer=handleByePlayer,null===nickname?disableMainView():(enableMainView(),logIn(nickname)),loginForm&&loginForm.addEventListener("submit",handleLogInSubmit);

},{"./chat":1,"./mySocket":5}],4:[function(require,module,exports){
"use strict";require("./logIn"),require("./players"),require("./mySocket"),require("./chat"),require("./gameManager");

},{"./chat":1,"./gameManager":2,"./logIn":3,"./mySocket":5,"./players":6}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.initMySocket=exports.updateMySocket=exports.getMySocket=void 0;var _chat=require("./chat"),_gameManager=require("./gameManager"),_logIn=require("./logIn"),_players=require("./players"),socket=null,getMySocket=function(){return socket};exports.getMySocket=getMySocket;var updateMySocket=function(e){e?(socket.nickname=e.nickname,socket.ready=e.ready,socket.leader=e.leader,socket.color=e.color):console.log("A game has been playing. Try Again Later~")};exports.updateMySocket=updateMySocket;var initMySocket=function(e){var a=window.events;(socket=e).on(a.updatePlayer,_players.handleUpdatePlayer),socket.on(a.helloPlayer,_logIn.handleHelloPlayer),socket.on(a.byePlayer,_logIn.handleByePlayer),socket.on(a.leaderNotif,_players.handleLeaderNotif),socket.on(a.newMessage,_chat.handleNewMessage),socket.on(a.serverMessage,_chat.handleServerMessage),socket.on(a.gameStart,_gameManager.handleGameStart),socket.on(a.nextTurn,_gameManager.handleNextTurn),socket.on(a.drawThis,_gameManager.handleDrawThis),socket.on(a.guessThis,_gameManager.handleGuessThis),socket.on(a.gameEnd,_gameManager.handleGameEnd),socket.on(a.updatePage,_gameManager.handleUpdatePage),socket.on(a.terminateGameNotif,_gameManager.handleTerminateGameNotif)};exports.initMySocket=initMySocket;

},{"./chat":1,"./gameManager":2,"./logIn":3,"./players":6}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleLeaderNotif=exports.handleUpdatePlayer=void 0;var _mySocket=require("./mySocket");function _objectDestructuringEmpty(e){if(null==e)throw new TypeError("Cannot destructure undefined")}var readyBtn=document.querySelector(".canvas__btn__ready"),playersDiv=document.querySelector(".chat__players__div"),handleUpdatePlayer=function(e){var a=e.sockets,t=(0,_mySocket.getMySocket)(),n=a.find(function(e){if(e.id===t.id)return!0});playersDiv.innerHTML="",a.map(function(e){var a=document.createElement("div");a.className="players";var t=document.createElement("i");t.classList.add("fas"),e.leader?(t.classList.add("fa-crown"),t.style.color="orange"):e.ready&&(t.classList.add("fa-check"),t.style.color="green");var n=document.createElement("div");1===e.nickname.length?n.innerHTML=e.nickname[0]:n.innerHTML=e.nickname[0]+e.nickname[1],n.style.backgroundColor=e.color,a.appendChild(t),a.appendChild(n),playersDiv.appendChild(a)}),n.leader?readyBtn.innerHTML="게임 시작":n.ready?readyBtn.innerHTML="준비 취소":readyBtn.innerHTML="준비",(0,_mySocket.updateMySocket)(n)};exports.handleUpdatePlayer=handleUpdatePlayer;var handleLeaderNotif=function(e){_objectDestructuringEmpty(e);var a=(0,_mySocket.getMySocket)();a.leader=!0,console.log(a.nickname),a.emit(window.events.leaderConfirm,{}),(0,_mySocket.updateMySocket)(a),console.log("players - leaderNotif",a.leader)};exports.handleLeaderNotif=handleLeaderNotif;var handleLobbyReady=function(e){e.preventDefault();var a=(0,_mySocket.getMySocket)();a.ready=!a.ready,a.leader||(a.ready?console.log("준비 완료 >>> 대기"):console.log("대기 >>> 준비 완료")),a.emit(window.events.lobbyReady,{ready:a.ready}),(0,_mySocket.updateMySocket)(a)};readyBtn&&readyBtn.addEventListener("click",handleLobbyReady);

},{"./mySocket":5}]},{},[4]);
