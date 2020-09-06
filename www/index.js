import { Universe, Cell } from "wasm_game_of_life";
import { memory } from "wasm_game_of_life/wasm_game_of_life_bg";

const CELL_SIZE = 7;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const width = 64;
const height = 64;
const universe = Universe.new(width, height);

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = (CELL_SIZE + 1) * width + 1;
canvas.height = (CELL_SIZE + 1) * height + 1;
const ctx = canvas.getContext("2d");

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for (let i = 0; i <= width; i++) {
        ctx.moveTo((CELL_SIZE + 1) * i + 1, 0)
        ctx.lineTo((CELL_SIZE + 1) * i + 1, (CELL_SIZE + 1) * height + 1)
    }

    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, (CELL_SIZE + 1) * j + 1);
        ctx.moveTo((CELL_SIZE + 1) * width + 1, (CELL_SIZE + 1) * j + 1);
    }
    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

const playPauseButton = document.getElementById("play-pause");
let animationID = null;

const play = () => {
    playPauseButton.textContent = "⏸";
    renderLoop();
}

const pause = () => {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationID);
    animationID = null;
}

playPauseButton.addEventListener("click", _ => {
    console.log("Paused");
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

const isPaused = () => animationID === null;

const renderLoop = () => {
    universe.tick();
    drawGrid();
    drawCells();
    animationID = requestAnimationFrame(renderLoop)
}
drawGrid();
drawCells();
play();
