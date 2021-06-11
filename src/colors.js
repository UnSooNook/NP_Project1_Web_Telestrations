const colors = [
    // Flat UI Palette v1
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#f1c40f",
    "#f39c12", "#e74c3c",
    // American Palette
    "#55efc4", "#81ecec", "#74b9ff", "#a29bfe", "#00b894",
    "#00cec9", "#0984e3", "#6c5ce7", "#fdcb6e", "#e17055",
    "#ff7675", "#fd79a8", "#e84393",
    // German Palette
    "#fc5c65", "#fd9644", "#fed330", "#26de81", "#2bcbba",
    "#eb3b5a", "#fa8231", "#f7b731", "#20bf6b", "#0fb9b1",
    "#45aaf2", "#4b7bec", "#a55eea", "#778ca3", "#2d98da",
    "#3867d6", "#8854d0"
];

export const chooseColors = (sockets) => {
    let color = "";
    let isOverlap = true;
    // 색상 뽑기
    while (isOverlap) {
        color = colors[Math.floor(Math.random() * colors.length)];
        isOverlap = sockets.find((socket) => {
            if (socket.color === color)
                return true;
        });
    }
    return color;
};