const WIDTH = 8;
const HEIGHT = 8;
const EMPTY_CODE = '.';
const FRUIT_CODE = 'f';
const HEAD_CODE = '@';
const BODY_CODE = '#';
const FRAME_RATE = 300;
let directionX = 0;
let directionY = 0; 
let body = [];
let fruitEaten = false;
let isGameOver = false;
let timerId;

const gridElement = document.querySelector("#grid");
const grid = getEmptyGrid(WIDTH, HEIGHT, EMPTY_CODE); 

let fruit = getRandomCoordinates(grid);
grid[fruit.row][fruit.col] = FRUIT_CODE;
 
let head = getRandomCoordinates(grid);
grid[head.row][head.col] = HEAD_CODE;

let prevHead = {row: head.row, col: head.col};


document.body.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && directionY !== -1) { 
        directionX = 0;
        directionY = 1;
    } else if (event.key === "ArrowUp" && directionY !== 1) {
        directionX = 0;
        directionY = -1;
    } else if (event.key === "ArrowLeft" && directionX !== 1) {
        directionY = 0;
        directionX = -1;
    } else if (event.key === "ArrowRight" && directionX !== -1) {
        directionY = 0;
        directionX = 1;
    }
}); 

document.querySelectorAll("button").forEach(buttonElement => {
    buttonElement.addEventListener("click", event => {
        if (event.target.classList.contains("down") && directionY !== -1) { 
            directionX = 0;
            directionY = 1;
        } else if (event.target.classList.contains("up") && directionY !== 1) {
            directionX = 0;
            directionY = -1;
        } else if (event.target.classList.contains("left") && directionX !== 1) {
            directionY = 0;
            directionX = -1;
        } else if (event.target.classList.contains("right") && directionX !== -1) {
            directionY = 0;
            directionX = 1;
        }
    })
});

document.querySelector('.replay-button').addEventListener('click', restartGame); 

createPageGrid(grid);

function createPageGrid(grid) {
    grid.forEach((row, rowIndex)=> {
        let rowElement = document.createElement("div");
        rowElement.classList.add("row");
        row.forEach((cell, cellIndex) => {
            let cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.classList.add(`cell-${rowIndex}${cellIndex}`);
            rowElement.appendChild(cellElement);
        });
        gridElement.appendChild(rowElement);
    });     
    console.log(gridElement);
}

setInterval(loop, FRAME_RATE);

function loop() {
    if (!isGameOver) {
        clearGrid();
        moveSnake();
        redraw();
        print(grid);
    }
}

function clearGrid() {
    gridElement.querySelectorAll(".row").forEach(row => {
        row.querySelectorAll(".cell").forEach(cell =>{
            cell.classList.remove("head");
            cell.classList.remove("fruit");
            cell.classList.remove("body");
        });
    });
   
    grid[fruit.row][fruit.col] = EMPTY_CODE;
    grid[head.row][head.col] = EMPTY_CODE;
    body.forEach(bodyPart => { 
        grid[bodyPart.row][bodyPart.col] = EMPTY_CODE; 
    });
}

function moveSnake() {
    fruitEaten = (head.row === fruit.row && head.col === fruit.col);
    if (fruitEaten) {
        body.unshift({row: prevHead.row, col: prevHead.col});
    }
    prevHead.row = head.row;
    prevHead.col = head.col;

    head.row += directionY;
    head.col += directionX; 

    if (head.row === grid.length) {
        head.row = 0;
    } else if (head.row === -1) {
        head.row = grid.length - 1;
    }

    if (head.col === grid[0].length) {
        head.col = 0;
    } else if (head.col === -1) {
        head.col = grid[0].length - 1;
    }

    body.forEach((bodyPart, i) => {
        if (i === body.length - 1) {
            bodyPart.row = prevHead.row;
            bodyPart.col = prevHead.col; 
        } else {
            bodyPart.row = body[i + 1].row;
            bodyPart.col = body[i + 1].col;
        }
    });
    for (let i = 0; i < body.length; i++) {
        if (body[i].row === head.row && body[i].col === head.col) {
            isGameOver = true;
            break;
        }
    }
}


function redraw() {
    body.forEach(bodyPart => { 
        grid[bodyPart.row][bodyPart.col] = BODY_CODE; 
        gridElement.querySelector(`.cell-${bodyPart.row}${bodyPart.col}`).classList.add("body");
    });
    if (fruitEaten) {
        fruit = getRandomCoordinates(grid); 
    }
    grid[fruit.row][fruit.col] = FRUIT_CODE;
    grid[head.row][head.col] = HEAD_CODE; 
    
    gridElement.querySelector(`.cell-${fruit.row}${fruit.col}`).classList.add("fruit");
    gridElement.querySelector(`.cell-${head.row}${head.col}`).classList.add("head");
}


function print(grid) {
    const scoreElement = document.querySelector('.score');
    const gameStatusElement = document.querySelector('.game-status');
    const replayButton = document.querySelector('.replay-button');
    
    scoreElement.textContent = body.length;
    
    if (isGameOver === false) {
        console.clear(); 
        console.log(grid.map(row => row.join(' ')).join('\n'),`\n\nYour Score: ${body.length}`);
    } else {
        gameStatusElement.textContent = "GAME OVER!";
        replayButton.style.display = 'block';
        console.log("GAME OVER!");
        clearInterval(timerId);
    }
}

function restartGame() {
    body = [];
    head = getRandomCoordinates(grid);
    directionX = 0;
    directionY = 0;
    isGameOver = false;

    clearGrid();
    print(grid);
    document.querySelector('.game-status').textContent = '';
    document.querySelector('.replay-button').style.display = 'none';

    timerId = setInterval(loop, FRAME_RATE);
}
  

function getRandomCoordinates(grid) {
    let randRowIndex;
    let randColumnIndex;
    do {
        randRowIndex = Math.floor(Math.random()*grid.length);
        randColumnIndex = Math.floor(Math.random()*grid[0].length);
    } while (grid[randRowIndex][randColumnIndex] !== EMPTY_CODE);
    
    return {row: randRowIndex, col: randColumnIndex};
} 


function getEmptyGrid(width, height, emptyCode) {
    let grid = [];
    for (let i = 0; i < height; i++) {
        let arr = [];
        for (let j = 0; j < width; j++) {
            arr.push(emptyCode);
        }
        grid.push(arr);
    }
    return grid;
}
