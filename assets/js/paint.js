import { getMySocket } from "./mySocket";

const canvas = document.getElementById("jsCanvas");
const controls = document.getElementById("jsControls");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const mode = document.getElementById("jsMode");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

const stopPainting = () => {
    painting = false;
};

const startPainting = () => {
    painting = true;
};

const beginPath = (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
};

// 선 그리기 (색상 포함)
const strokePath = (x, y, color = null) => {
    let currentColor = ctx.strokeStyle;
    if (color !== null) {
        ctx.strokeStyle = color;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.strokeStyle = currentColor;
};

const onMouseMove = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    // 그리기 시작
    if (!painting) {
        beginPath(x, y);
        // 그리기 시작(나)
        getMySocket().emit(window.events.beginPath, { x, y });
        // 그리는 중
    } else if (!filling) {
        strokePath(x, y);
        // 그리기(나)
        getMySocket().emit(window.events.strokePath, {
            x,
            y,
            color: ctx.strokeStyle,
        });
    }
};

// 색상 변경 이벤트 처리
const handleColorClick = (event) => {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
};

// 그리기 / 채우기 선택 이벤트 처리
function handleModeClick() {
    if (filling === true) {
        filling = false;
        mode.innerText = "Fill";
    } else {
        filling = true;
        mode.innerText = "Paint";
    }
}

// 채우기 함수
const fill = (color = null) => {
    let currentColor = ctx.fillStyle;
    if (color !== null) {
        ctx.fillStyle = color;
    }
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = currentColor;
};

// 채우기 이벤트 처리
const handleCanvasClick = () => {
    if (filling) {
        fill();
        getMySocket().emit(window.events.fill, { color: ctx.fillStyle });
    }
};

const handleCM = (event) => {
    event.preventDefault();
};

// 색상 선택 이벤트 추기
Array.from(colors).forEach((color) =>
    color.addEventListener("click", handleColorClick)
);

// 그리기 / 채우기 선택 이벤트 추가
if (mode) {
    mode.addEventListener("click", handleModeClick);
}

// 그리기 시작 이벤트
export const handleBeganPath = ({ x, y }) => {
    beginPath(x, y);
};

// 그리기 이벤트
export const handleStrokedPath = ({ x, y, color }) => {
    strokePath(x, y, color);
};

// 채우기 이벤트
export const handleFilled = ({ color }) => {
    fill(color);
};

// 그리기 해제
export const disableCanvas = () => {
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mouseleave", stopPainting);
    canvas.removeEventListener("click", handleCanvasClick);
};

// 그리기 적용
export const enableCanvas = () => {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
};

// 그리기 툴 해제
export const hideControls = () => {
    controls.style.display = "flex";
};

// 그리기 툴 적용
export const showControls = () => {
    controls.style.display = "flex";
};

// 캔버스 초기화
export const resetCanvas = () => {
    fill("#FFFFFF");
};

if (canvas) {
    canvas.addEventListener("contextmenu", handleCM);
    hideControls();
}

const drawBtn = document.querySelector(".canvas__btn__draw");
let draw = false;

const toogleDraw = () => {
    if (draw) {
        disableCanvas();
        drawBtn.innerHTML = "그리기 시작 (테스트)";
    } else {
        enableCanvas();
        drawBtn.innerHTML = "그리기 종료 (테스트)";
    }
    draw = !draw;
};

if (drawBtn) {
    drawBtn.addEventListener("click", toogleDraw);
}
