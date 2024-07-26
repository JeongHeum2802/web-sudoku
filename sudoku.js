// 보드 생성 함수
function createSudokuBoard() {
    let board = createEmptyBoard();
    fillBoard(board);
    if(removeNumbers(board)===0) {
        return 0;
    }
    return board;
}

// 9*9 보드 생성 함수
function createEmptyBoard() {
    let board = [];
    for(let i = 0; i < 9; i++) {
        board.push(new Array(9).fill(0));
    }
    return board;
}

// 보드 채우는 함수
function fillBoard(board) {
    if(!fillcell(board, 0, 0)) {
        console.log("스도쿠 보드를 채우지 못했습니다.");
    }
}

// 각 셀을 채우는 함수
function fillcell(board, row, col) {
    if(row === 9) return true;
    if(col === 9) return fillcell(board, row + 1, 0);
    if(board[row][col] !== 0) return fillcell(board, row, col + 1);

    const numbers = shuffle([1,2,3,4,5,6,7,8,9]);
    for(let num of numbers) {
        if(isValid(board, row, col, num)) {
            board[row][col] = num;
            if(fillcell(board, row, col + 1)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

// 배열을 섞는 함수
function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 숫자 유효 확인 함수
function isValid(board, row, col, num) {
    for(let i = 0; i < 9; i++) {
        if(i === col) {
            continue;
        }
        if(board[row][i] == num) {
            return false;
        }
    }

    for(let i = 0; i < 9; i++) {
        if(i === row) {
            continue;
        }
        if(board[i][col] === num) {
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for(let r = 0; r < 3; r++) {
        for(let c = 0; c < 3; c++) {
            if(startRow + r === row && startCol + c === col) {
                continue;
            }
            if(board[startRow + r][startCol + c] === num) {
                return false;
            }
        }
    }
    return true;
}

// 정답 확인 함수 ,, 1 : 정답, 2 : 오답, 3 : 빈칸오류
function checkAnswer() {
    const cells = document.getElementById("sudoku-container").children;
    let tempBoard = createEmptyBoard();

    let n = 0;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            tempBoard[i][j] = cells[n].children[0].value;
            if(tempBoard[i][j] === '') {
                return 3;
            }
            n++;
        }
    }
    
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(isValid(tempBoard, i , j, tempBoard[i][j]) === false) {
                return 2;
            }
        }
    } 
    return 1;
}

// 일부 숫자를 제거하여 퍼즐을 만드는 함수
function removeNumbers(board) {
    const attempts = document.getElementById("attempsValue").value;

    if(attempts < 0 || attempts > 81) {
        alert("빈칸 수의 유효범위는 0부터 81까지 입니다.");
        return 0;
    }

    for(let i = 0; i < attempts; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        while(board[row][col] === 0) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        const backup = board[row][col];
        board[row][col] = 0;
        const boardCopy = board.map(arr => arr.slice());
        if(!canSolve(boardCopy)) {
            board[row][col] = backup;
        }
    }
}

// 보드를 풀 수 있는지 확인하는 함수
function canSolve(board) {
    return solve(board);
}

function solve(board) {
    for(let row = 0; row < 9; row++) {
        for(let col = 0; col < 9; col++) {
            if(board[row][col] === 0) {
                for(let num = 1; num <= 9; num++) {
                    if(isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if(solve(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// 스도쿠 보드를 HTML 요소로 변한
function renderBoard(board) {
    const container = document.getElementById('sudoku-container');
    container.innerHTML = '';

    for(let row = 0; row < 9; row++) {
        for(let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');

            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = board[row][col] === 0 ? '' : board[row][col];
            input.disabled = board[row][col] !== 0;

            if(board[row][col] !== 0) {
                cell.style.backgroundColor = '#EBF5FF';
            }

            cell.appendChild(input);
            container.appendChild(cell);
        }
    }
}

// 스도쿠 보드 생성 및 렌더링
function makeSudoku() {
    const board = createSudokuBoard();
    renderBoard(board);
}

window.onload = function () {
    const container = document.getElementById('sudoku-container');
    container.innerHTML = '';

    for(let row = 0; row < 9; row++) {
        for(let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');

            const input = document.createElement('input');

            cell.appendChild(input);
            container.appendChild(cell);
        }
    }
}

const makeBtn = document.getElementById('maker_btn');
const printBtn = document.getElementById('print_btn');
const solveBtn = document.getElementById('solve_btn');

makeBtn.addEventListener('click', makeSudoku);
solveBtn.addEventListener('click', function() {
    let cmd = checkAnswer();
    if(cmd === 1) {
        alert("스도쿠를 해결하였습니다");
    }
    else if(cmd === 2) {
        alert("다시 고민해 보세요");
    }
    else if(cmd === 3) {
        alert("빈칸을 채우고 버튼을 눌러주세요");
    } 
});
printBtn.addEventListener('click', function() {
    print();
});