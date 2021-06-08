(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleNewMessage=exports.shootChat=void 0;var _mySocket=require("./mySocket"),chatForm=document.querySelector(".chat__form"),chatListView=document.querySelector(".chat__view__div"),shootChat=function(e,t){var a=document.createElement("p");a.innerText=e,a.style.color=t,chatListView.appendChild(a)};exports.shootChat=shootChat;var handleNewMessage=function(e){var t=e.nickname,a=e.message;shootChat("".concat(t,": ").concat(a),"white")};exports.handleNewMessage=handleNewMessage;var handleSubmintChat=function(e){e.preventDefault();var t=chatForm.querySelector("input"),a=t.value;t.value="",(0,_mySocket.getMySocket)().emit(window.events.sendMessage,{message:a})},initChat=function(){chatForm.addEventListener("submit",handleSubmintChat)};initChat();

},{"./mySocket":4}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleByePlayer=exports.handleHelloPlayer=void 0;var _chat=require("./chat"),_mySocket=require("./mySocket"),loginContainer=document.querySelector(".login__container"),mainContainer=document.querySelector(".main__container"),loginForm=document.querySelector(".login__form"),NICKNAME="nickname",nickname=localStorage.getItem(NICKNAME),logIn=function(e){var n=io("/");n.emit(window.events.logIn,{nickname:e}),(0,_mySocket.initMySocket)(n)},handleHelloPlayer=function(e){var n=e.nickname;(0,_chat.shootChat)("".concat(n," just joined!"),"white")};exports.handleHelloPlayer=handleHelloPlayer;var handleByePlayer=function(e){var n=e.nickname;(0,_chat.shootChat)("".concat(n," just left!"),"red")};exports.handleByePlayer=handleByePlayer;var handleLoginSubmit=function(e){e.preventDefault();var n=loginForm.querySelector("input"),o=n.value;n.value="",localStorage.setItem(NICKNAME,o),initLogin()},initLogin=function(){nickname=localStorage.getItem(NICKNAME),console.log("nickname: ".concat(nickname)),null===nickname?loginForm.addEventListener("submit",handleLoginSubmit):(loginForm.removeEventListener("submit",handleLoginSubmit),loginContainer.classList.add("hidden"),mainContainer.classList.remove("hidden"),logIn(nickname))};initLogin();

},{"./chat":1,"./mySocket":4}],3:[function(require,module,exports){
"use strict";require("./mySocket"),require("./logIn"),require("./chat"),require("./players"),require("./paint");

},{"./chat":1,"./logIn":2,"./mySocket":4,"./paint":5,"./players":6}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.initMySocket=exports.updateMySocket=exports.getMySocket=void 0;var _logIn=require("./logIn"),_chat=require("./chat"),_paint=require("./paint"),_players=require("./players"),socket=null,getMySocket=function(){return socket};exports.getMySocket=getMySocket;var updateMySocket=function(e){socket.nickname=e.nickname,socket.ready=e.ready,socket.leader=e.leader};exports.updateMySocket=updateMySocket;var initMySocket=function(e){var t=window.events;(socket=e).on(t.updatePlayer,_players.handleUpdatePlayer),socket.on(t.helloPlayer,_logIn.handleHelloPlayer),socket.on(t.byePlayer,_logIn.handleByePlayer),socket.on(t.leaderNotif,_players.handleLeaderNotif),socket.on(t.newMessage,_chat.handleNewMessage),socket.on(t.beganPath,_paint.handleBeganPath),socket.on(t.strokedPath,_paint.handleStrokedPath),socket.on(t.filled,_paint.handleFilled)};exports.initMySocket=initMySocket;

},{"./chat":1,"./logIn":2,"./paint":5,"./players":6}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.resetCanvas=exports.showControls=exports.hideControls=exports.enableCanvas=exports.disableCanvas=exports.handleFilled=exports.handleStrokedPath=exports.handleBeganPath=void 0;var _mySocket=require("./mySocket"),canvas=document.getElementById("jsCanvas"),controls=document.getElementById("jsControls"),ctx=canvas.getContext("2d"),colors=document.getElementsByClassName("jsColor"),mode=document.getElementById("jsMode"),INITIAL_COLOR="#2c2c2c",CANVAS_SIZE=700;canvas.width=CANVAS_SIZE,canvas.height=CANVAS_SIZE,ctx.fillStyle="white",ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE),ctx.strokeStyle=INITIAL_COLOR,ctx.fillStyle=INITIAL_COLOR,ctx.lineWidth=2.5;var painting=!1,filling=!1,stopPainting=function(){painting=!1},startPainting=function(){painting=!0},beginPath=function(e,t){ctx.beginPath(),ctx.moveTo(e,t)},strokePath=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,a=ctx.strokeStyle;null!==n&&(ctx.strokeStyle=n),ctx.lineTo(e,t),ctx.stroke(),ctx.strokeStyle=a},onMouseMove=function(e){var t=e.offsetX,n=e.offsetY;painting?filling||(strokePath(t,n),(0,_mySocket.getMySocket)().emit(window.events.strokePath,{x:t,y:n,color:ctx.strokeStyle})):(beginPath(t,n),(0,_mySocket.getMySocket)().emit(window.events.beginPath,{x:t,y:n}))},handleColorClick=function(e){var t=e.target.style.backgroundColor;ctx.strokeStyle=t,ctx.fillStyle=t};function handleModeClick(){!0===filling?(filling=!1,mode.innerText="Fill"):(filling=!0,mode.innerText="Paint")}var fill=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=ctx.fillStyle;null!==e&&(ctx.fillStyle=e),ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE),ctx.fillStyle=t},handleCanvasClick=function(){filling&&(fill(),(0,_mySocket.getMySocket)().emit(window.events.fill,{color:ctx.fillStyle}))},handleCM=function(e){e.preventDefault()};Array.from(colors).forEach(function(e){return e.addEventListener("click",handleColorClick)}),mode&&mode.addEventListener("click",handleModeClick);var handleBeganPath=function(e){var t=e.x,n=e.y;beginPath(t,n)};exports.handleBeganPath=handleBeganPath;var handleStrokedPath=function(e){var t=e.x,n=e.y,a=e.color;strokePath(t,n,a)};exports.handleStrokedPath=handleStrokedPath;var handleFilled=function(e){var t=e.color;fill(t)};exports.handleFilled=handleFilled;var disableCanvas=function(){canvas.removeEventListener("mousemove",onMouseMove),canvas.removeEventListener("mousedown",startPainting),canvas.removeEventListener("mouseup",stopPainting),canvas.removeEventListener("mouseleave",stopPainting),canvas.removeEventListener("click",handleCanvasClick)};exports.disableCanvas=disableCanvas;var enableCanvas=function(){canvas.addEventListener("mousemove",onMouseMove),canvas.addEventListener("mousedown",startPainting),canvas.addEventListener("mouseup",stopPainting),canvas.addEventListener("mouseleave",stopPainting),canvas.addEventListener("click",handleCanvasClick)};exports.enableCanvas=enableCanvas;var hideControls=function(){controls.style.display="flex"};exports.hideControls=hideControls;var showControls=function(){controls.style.display="flex"};exports.showControls=showControls;var resetCanvas=function(){fill("#FFFFFF")};exports.resetCanvas=resetCanvas,canvas&&(canvas.addEventListener("contextmenu",handleCM),hideControls());var drawBtn=document.querySelector(".canvas__btn__draw"),draw=!1,toogleDraw=function(){draw?(disableCanvas(),drawBtn.innerHTML="그리기 시작 (테스트)"):(enableCanvas(),drawBtn.innerHTML="그리기 종료 (테스트)"),draw=!draw};drawBtn&&drawBtn.addEventListener("click",toogleDraw);

},{"./mySocket":4}],6:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleLeaderNotif=exports.handleUpdatePlayer=void 0;var _mySocket=require("./mySocket");function _objectDestructuringEmpty(e){if(null==e)throw new TypeError("Cannot destructure undefined")}var readyBtn=document.querySelector(".canvas__btn__ready"),handleUpdatePlayer=function(e){var t=e.sockets,r=(0,_mySocket.getMySocket)(),a=t.find(function(e){if(e.id===r.id)return!0});(0,_mySocket.updateMySocket)(a)};exports.handleUpdatePlayer=handleUpdatePlayer;var handleLeaderNotif=function(e){_objectDestructuringEmpty(e);var t=(0,_mySocket.getMySocket)();t.leader=!0,t.emit(window.events.leaderConfirm,{}),(0,_mySocket.updateMySocket)(t),console.log("players - leaderNotif",t.leader),t.emit(window.events.sendMessage,{message:"방장이 되었습니다."})};exports.handleLeaderNotif=handleLeaderNotif;var handleLobbyReady=function(e){e.preventDefault();var t=(0,_mySocket.getMySocket)();t.ready?(t.ready=!1,console.log("준비 완료 -> 대기"),readyBtn.innerHTML="준비"):(t.ready=!0,console.log("대기 -> 준비 완료"),readyBtn.innerHTML="준비 완료"),t.emit(window.events.lobbyReady,{ready:t.ready}),(0,_mySocket.updateMySocket)(t)};readyBtn&&readyBtn.addEventListener("click",handleLobbyReady);

},{"./mySocket":4}]},{},[3]);
