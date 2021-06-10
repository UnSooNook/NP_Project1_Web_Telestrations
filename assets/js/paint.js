import "./canvas2svg";

const canvas = document.querySelector(".canvas__draw");
const ctx = canvas.getContext("2d");
const controls = document.querySelector(".canvas__controls");
const colorBtns = controls.querySelectorAll("button");

const INITIAL_COLOR = "rgb(0, 0, 0)";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 500;

// 나중에 SVG로 변환할 ctx
const ctxSVG = new C2S(CANVAS_WIDTH, CANVAS_HEIGHT);

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
ctxSVG.fillStyle = "white";
ctxSVG.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
// 검정 활성화
colorBtns[1].classList.add("clicked");
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;
ctxSVG.strokeStyle = INITIAL_COLOR;
ctxSVG.fillStyle = INITIAL_COLOR;
ctxSVG.lineWidth = 2.5;

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
    ctxSVG.beginPath();
    ctxSVG.moveTo(x, y);
};

// 선 그리기 (색상 포함)
const strokePath = (x, y, color = null) => {
    let currentColor = ctx.strokeStyle;
    if (color !== null) {
        ctx.strokeStyle = color;
        ctxSVG.strokeStyle = color;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.strokeStyle = currentColor;
    ctxSVG.lineTo(x, y);
    ctxSVG.stroke();
    ctxSVG.strokeStyle = currentColor;
};

const onMouseMove = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    // 그리기 시작
    if (!painting) {
        beginPath(x, y);
        // 그리는 중
    } else if (!filling) {
        strokePath(x, y);
    }
};

export const clearCanvas = () => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.beginPath();
    ctxSVG.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctxSVG.beginPath();
};

// 색상 변경 이벤트 처리
const handleColorClick = ({ target }) => {
    // 초기화 버튼인 경우
    if (target.innerHTML === "초기화") {
        getCanvasData();
        clearCanvas();
    } else {
        const color = target.style.backgroundColor;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctxSVG.strokeStyle = color;
        ctxSVG.fillStyle = color;
        colorBtns.forEach((colorBtn) => colorBtn.classList.remove("clicked"));
        target.classList.add("clicked");
    }
};

const handleCM = (event) => {
    event.preventDefault();
};

// 그리기 시작 이벤트
export const handleBeganPath = ({ x, y }) => {
    beginPath(x, y);
};

// 그리기 이벤트
export const handleStrokedPath = ({ x, y, color }) => {
    strokePath(x, y, color);
};

// 그리기 해제
export const disableCanvas = () => {
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mouseleave", stopPainting);
};

// 그리기 적용
export const enableCanvas = () => {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
};

// Canvas 데이터를 svg로 저장
export const getCanvasData = () => {
    return ctxSVG.getSerializedSvg(true);
};

if (canvas) {
    canvas.addEventListener("contextmenu", handleCM);
    colorBtns.forEach((colorBtn) => {
        colorBtn.addEventListener("click", handleColorClick);
    });
    enableCanvas();
}
