(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleNewMessage=exports.shootChat=void 0;var _mySocket=require("./mySocket"),chatForm=document.querySelector(".chat__form"),chatListView=document.querySelector(".chat__view__div"),shootChat=function(e,t){var o=document.createElement("p");o.innerText=e,o.style.color=t,chatListView.appendChild(o),console.log("shootChat",e)};exports.shootChat=shootChat;var handleNewMessage=function(e){var t=e.nickname,o=e.message;shootChat("".concat(t,": ").concat(o),"white"),console.log("handleNewMessage","".concat(t,": ").concat(o))};exports.handleNewMessage=handleNewMessage;var handleSendMessage=function(e){e.preventDefault();var t=chatForm.querySelector("input"),o=t.value;(0,_mySocket.getMySocket)().emit(window.events.sendMessage,{message:o}),t.value="",console.log("handleSendMessage",o)};chatForm&&chatForm.addEventListener("submit",handleSendMessage);

},{"./mySocket":5}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleNextPage=exports.handlePrevPage=exports.handleUpdatePage=exports.handleGameEnd=exports.handleGuessThis=exports.handleDrawThis=exports.handleNextTurn=exports.handleTerminateGame=exports.handleGameStart=void 0;var _mySocket=require("./mySocket");function _objectDestructuringEmpty(e){if(null==e)throw new TypeError("Cannot destructure undefined")}var inPlaying=!1,sketchBook=[],sketchBookPage=0,finalPage=0,currPage=-1,gameTurn=-1,finalTurn=-1,timer=null,timeRemaining=0,currMode=-1,submit=!1,TIMELIMIT=2,handleTimer=function(){timeRemaining--,console.log("timer:",timeRemaining),0===timeRemaining&&(console.log("Time Expired"),gameSubmit(),clearInterval(timer))},handleGameStart=function(e){var a=e.word,t=e.maxTurn;inPlaying=!0,gameTurn=0,finalTurn=t,currMode=0,timeRemaining=TIMELIMIT,timer=setInterval(handleTimer,1e3),console.log("gameManager - gameStart!",a)};exports.handleGameStart=handleGameStart;var handleTerminateGame=function(e){_objectDestructuringEmpty(e),inPlaying=!1,gameTurn=-1,finalTurn=-1,currMode=-1,submit=!1,console.log("gameManager - terminateGame..")};exports.handleTerminateGame=handleTerminateGame;var handleNextTurn=function(e){var a=e.currTurn;clearInterval(timer),gameTurn=a,a%2==1?(currMode=1,(0,_mySocket.getMySocket)().emit(window.events.letMeDraw,{})):(currMode=2,(0,_mySocket.getMySocket)().emit(window.events.letMeGuess,{})),console.log("gameManager - handleNextTurn",gameTurn)};exports.handleNextTurn=handleNextTurn;var gameSubmit=function(){var e=null;0===currMode?(console.log("gameManager - handleGameSubmit 제시어 제출"),e="".concat((0,_mySocket.getMySocket)().nickname,": 제시어")):1===currMode?(console.log("gameManager - handleGameSubmit 그리기 제출"),e="".concat((0,_mySocket.getMySocket)().nickname,"'s 그림")):(console.log("gameManager - handleGameSubmit 맞추기 제출"),e="".concat((0,_mySocket.getMySocket)().nickname,"'s 정답")),(0,_mySocket.getMySocket)().emit(window.events.gameSubmit,{data:e}),submit=!0},handleGameSubmit=function(e){e.preventDefault(),gameSubmit()},handleDrawThis=function(e){var a=e.word;console.log("gameManager - handleDrawThis:",a),timeRemaining=TIMELIMIT,timer=setInterval(handleTimer,1e3)};exports.handleDrawThis=handleDrawThis;var handleGuessThis=function(e){var a=e.drawing;console.log("gameManager - handleGuessThis:",a),timeRemaining=TIMELIMIT,timer=setInterval(handleTimer,1e3)};exports.handleGuessThis=handleGuessThis;var pageUpdate=function(){var e=currPage%sketchBookPage;currMode=0===e?0:e%2==1?1:2;var a=Math.floor(currPage/sketchBookPage),t=sketchBook[a].history[e];console.log("gameManager - pageUpdate:",a,e,t)},handleGameEnd=function(e){var a=e.finalSketchBook;clearInterval(timer),sketchBook=a,sketchBookPage=a[0].history.length,finalPage=a.length*a[0].history.length,currPage=0,(0,_mySocket.getMySocket)().leader&&(0,_mySocket.getMySocket)().emit(window.events.updatePageNum,{newPage:currPage})};exports.handleGameEnd=handleGameEnd;var handleUpdatePage=function(e){var a=e.newPage;currPage=a,console.log("gameManager - handlePageUpdate",currPage),pageUpdate()};exports.handleUpdatePage=handleUpdatePage;var handlePrevPage=function(e){e.preventDefault(),0!==currPage&&(currPage--,(0,_mySocket.getMySocket)().emit(window.events.updatePageNum,{newPage:currPage}))};exports.handlePrevPage=handlePrevPage;var handleNextPage=function(e){e.preventDefault(),currPage!==finalPage-1&&(currPage++,(0,_mySocket.getMySocket)().emit(window.events.updatePageNum,{newPage:currPage}))};exports.handleNextPage=handleNextPage;var submitButton=document.getElementById("jsSubmitButton"),prevButton=document.getElementById("jsPrevButton"),nextButton=document.getElementById("jsNextButton");submitButton&&(submitButton.addEventListener("click",handleGameSubmit),prevButton.addEventListener("click",handlePrevPage),nextButton.addEventListener("click",handleNextPage));

},{"./mySocket":5}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleByePlayer=exports.handleHelloPlayer=void 0;var _chat=require("./chat"),_mySocket=require("./mySocket"),loginContainer=document.querySelector(".login__container"),mainContainer=document.querySelector(".main__container"),loginForm=document.querySelector(".login__form"),NICKNAME="nickname",nickname=localStorage.getItem(NICKNAME),logIn=function(e){var n=io("/");n.emit(window.events.logIn,{nickname:e}),(0,_mySocket.initMySocket)(n)},handleLogInSubmit=function(e){e.preventDefault();var n=loginForm.querySelector("input"),o=n.value;n.value="",localStorage.setItem(NICKNAME,o),loginContainer.classList.add("hidden"),mainContainer.classList.remove("hidden"),logIn(nickname=o)},handleHelloPlayer=function(e){var n=e.nickname;(0,_chat.shootChat)("".concat(n," just joined!"),"white"),console.log("notifications - hello",n)};exports.handleHelloPlayer=handleHelloPlayer;var handleByePlayer=function(e){var n=e.nickname;(0,_chat.shootChat)("".concat(n," just left!"),"red"),console.log("notifications - hello",n)};exports.handleByePlayer=handleByePlayer,null===nickname?(loginContainer.classList.remove("hidden"),mainContainer.classList.add("hidden")):(loginContainer.classList.add("hidden"),mainContainer.classList.remove("hidden"),logIn(nickname)),loginForm&&loginForm.addEventListener("submit",handleLogInSubmit);

},{"./chat":1,"./mySocket":5}],4:[function(require,module,exports){
"use strict";require("./logIn"),require("./players"),require("./mySocket"),require("./chat"),require("./gameManager");

},{"./chat":1,"./gameManager":2,"./logIn":3,"./mySocket":5,"./players":6}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.initMySocket=exports.updateMySocket=exports.getMySocket=void 0;var _chat=require("./chat"),_gameManager=require("./gameManager"),_logIn=require("./logIn"),_players=require("./players"),socket=null,getMySocket=function(){return socket};exports.getMySocket=getMySocket;var updateMySocket=function(e){socket.nickname=e.nickname,socket.ready=e.ready,socket.leader=e.leader};exports.updateMySocket=updateMySocket;var initMySocket=function(e){var a=window.events;(socket=e).on(a.updatePlayer,_players.handleUpdatePlayer),socket.on(a.helloPlayer,_logIn.handleHelloPlayer),socket.on(a.byePlayer,_logIn.handleByePlayer),socket.on(a.leaderNotif,_players.handleLeaderNotif),socket.on(a.newMessage,_chat.handleNewMessage),socket.on(a.gameStart,_gameManager.handleGameStart),socket.on(a.terminateGame,_gameManager.handleTerminateGame),socket.on(a.nextTurn,_gameManager.handleNextTurn),socket.on(a.drawThis,_gameManager.handleDrawThis),socket.on(a.guessThis,_gameManager.handleGuessThis),socket.on(a.gameEnd,_gameManager.handleGameEnd),socket.on(a.updatePage,_gameManager.handleUpdatePage)};exports.initMySocket=initMySocket;

},{"./chat":1,"./gameManager":2,"./logIn":3,"./players":6}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleLeaderNotif=exports.handleUpdatePlayer=void 0;var _mySocket=require("./mySocket");function _objectDestructuringEmpty(e){if(null==e)throw new TypeError("Cannot destructure undefined")}var readyBtn=document.querySelector(".canvas__btn__ready"),handleUpdatePlayer=function(e){var t=e.sockets,r=(0,_mySocket.getMySocket)(),a=t.find(function(e){if(e.id===r.id)return!0});(0,_mySocket.updateMySocket)(a)};exports.handleUpdatePlayer=handleUpdatePlayer;var handleLeaderNotif=function(e){_objectDestructuringEmpty(e);var t=(0,_mySocket.getMySocket)();t.leader=!0,t.emit(window.events.leaderConfirm,{}),(0,_mySocket.updateMySocket)(t),console.log("players - leaderNotif",t.leader)};exports.handleLeaderNotif=handleLeaderNotif;var handleLobbyReady=function(e){e.preventDefault();var t=(0,_mySocket.getMySocket)();t.ready?(t.ready=!1,console.log("준비 완료 >>> 대기")):(t.ready=!0,console.log("대기 >>> 준비 완료")),t.emit(window.events.lobbyReady,{ready:t.ready}),(0,_mySocket.updateMySocket)(t)};readyBtn&&readyBtn.addEventListener("click",handleLobbyReady);

},{"./mySocket":5}]},{},[4]);
