const chessboard = document.getElementById('chessboard');
const capturedWhites = document.getElementById('captured-whites');
const capturedBlacks = document.getElementById('captured-blacks');
const initialBoardSetup = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

let draggedPiece = null;
let draggedFromSquare = null;
let currentTurn = 'white';  // Белые начинают игру

// Определяем, к какой стороне принадлежит фигура
function isWhitePiece(piece) {
    return piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817; // Белые фигуры
}

function isBlackPiece(piece) {
    return piece.charCodeAt(0) >= 9818 && piece.charCodeAt(0) <= 9823; // Чёрные фигуры
}

function createChessboard() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.setAttribute('data-row', row);
            square.setAttribute('data-col', col);
            
            const piece = initialBoardSetup[row][col];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.textContent = piece;
                pieceElement.classList.add('piece');
                pieceElement.setAttribute('draggable', true);
                square.appendChild(pieceElement);

                // Drag event listeners
                pieceElement.addEventListener('dragstart', handleDragStart);
                pieceElement.addEventListener('dragend', handleDragEnd);
            }

            // Drop event listeners
            square.addEventListener('dragover', handleDragOver);
            square.addEventListener('drop', handleDrop);
            chessboard.appendChild(square);
        }
    }
}

function handleDragStart(event) {
    const piece = event.target.textContent;
    
    // Проверка хода: если ходят белые, можно двигать только белые фигуры, и наоборот
    if ((currentTurn === 'white' && isWhitePiece(piece)) || 
        (currentTurn === 'black' && isBlackPiece(piece))) {
        draggedPiece = event.target;
        draggedFromSquare = draggedPiece.parentElement;
    } else {
        event.preventDefault();  // Запрещаем перетаскивание неправильной фигуры
    }
}

function handleDragEnd() {
    draggedPiece = null;
    draggedFromSquare = null;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    
    const targetSquare = event.target.closest('div');
    
    if (draggedPiece) {
        const targetPiece = targetSquare.firstChild ? targetSquare.firstChild.textContent : null;
        
        // Если в цели есть фигура и она противоположного цвета, "съедаем" её
        if (targetPiece && (
            (isWhitePiece(draggedPiece.textContent) && isBlackPiece(targetPiece)) ||
            (isBlackPiece(draggedPiece.textContent) && isWhitePiece(targetPiece))
        )) {
            // Отображаем съеденные фигуры
            if (isWhitePiece(targetPiece)) {
                capturedWhites.textContent += targetPiece + ' ';
            } else {
                capturedBlacks.textContent += targetPiece + ' ';
            }
            
            // Убираем вражескую фигуру
            targetSquare.innerHTML = '';
        }
        
        // Перемещаем фигуру
        targetSquare.appendChild(draggedPiece);
        
        // Очищаем исходную клетку
        if (draggedFromSquare) {
            draggedFromSquare.innerHTML = '';
        }

        // Смена хода
        currentTurn = (currentTurn === 'white') ? 'black' : 'white';
    }
}

createChessboard();
