import React, { useState } from "react";
import './Sudoku.css';

export default function Sudoku() {
  const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [isInvalidMove, setIsInvalidMove] = useState(false);
  const [isSolutionValid, setIsSolutionValid] = useState<boolean | null>(null);

  const isValidMove = (board: number[][], row: number, col: number, value: number) => {
    for (let c = 0; c < 9; c++) if (c !== col && board[row][c] === value) return false;
    for (let r = 0; r < 9; r++) if (r !== row && board[r][col] === value) return false;
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) return false;
      }
    }
    return true;
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value === '') {
      const updatedBoard = [...board];
      updatedBoard[row][col] = 0;
      setBoard(updatedBoard);
      setIsInvalidMove(false);
      return;
    }

    const newValue = parseInt(value, 10);
    if (isNaN(newValue) || newValue < 1 || newValue > 9) return;

    const updatedBoard = [...board];
    if (isValidMove(updatedBoard, row, col, newValue)) {
      updatedBoard[row][col] = newValue;
      setBoard(updatedBoard);
      setIsInvalidMove(false);
    } else {
      setIsInvalidMove(true);
    }
  };

  const handleCheckSolution = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row][col];
        if (value === 0 || !isValidMove(board, row, col, value)) {
          setIsSolutionValid(false);
          return;
        }
      }
    }
    setIsSolutionValid(true);
  };

  const loadEasyPuzzle = () => {
    setIsSolutionValid(null);
    setIsInvalidMove(false);
    setBoard([
      [1, 9, 6, 3, 2, 7, 8, 5, 4],
  [5, 4, 7, 8, 0, 0, 2, 1, 3],
  [2, 8, 3, 5, 1, 4, 7, 6, 9],
  [9, 1, 4, 0, 0, 3, 6, 0, 5],
  [0, 5, 2, 4, 0, 0, 9, 0, 0],
  [6, 0, 8, 9, 5, 0, 4, 0, 0],
  [4, 6, 9, 1, 3, 8, 5, 7, 2],
  [8, 0, 1, 0, 4, 5, 3, 9, 6],
  [0, 0, 5, 6, 0, 0, 1, 4, 8]
    ]);
  };

  const loadMediumPuzzle = () => {
    setIsSolutionValid(null);
    setIsInvalidMove(false);
    setBoard([
  [3, 4, 5, 0, 0, 0, 0, 0, 8],
  [6, 1, 0, 0, 8, 3, 5, 4, 9],
  [7, 9, 0, 0, 4, 5, 0, 0, 6],
  [0, 0, 0, 1, 5, 7, 0, 0, 0],
  [0, 0, 0, 0, 6, 4, 9, 0, 0],
  [0, 7, 1, 9, 0, 0, 4, 0, 0],
  [0, 0, 9, 0, 2, 0, 6, 0, 4],
  [0, 5, 0, 0, 1, 0, 0, 0, 0],
  [2, 0, 6, 0, 0, 0, 3, 0, 0]
    ]);
  };

  const loadHardPuzzle = () => {
    setIsSolutionValid(null);
    setIsInvalidMove(false);
    setBoard([
      [0, 0, 0, 8, 0, 0, 4, 2, 0],
  [5, 0, 0, 6, 7, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 9, 0, 0, 5],
  [7, 4, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 9, 0, 3, 0, 7, 0, 0],
  [0, 0, 0, 0, 0, 7, 0, 4, 8],
  [8, 0, 0, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 9, 8, 0, 0, 3],
  [0, 9, 5, 0, 0, 3, 0, 0, 0]
    ]);
  };

  const clearBoard = () => {
    setIsSolutionValid(null);
    setIsInvalidMove(false);
    setBoard(emptyBoard);
  };

  return (
    <div className="sudoku-container">
      {/* Sidebar with buttons */}
      <div className="sidebar">
        <button onClick={loadEasyPuzzle} className="control-btn easy">Easy</button>
        <button onClick={loadMediumPuzzle} className="control-btn medium">Medium</button>
        <button onClick={loadHardPuzzle} className="control-btn hard">Hard</button>
        <button onClick={clearBoard} className="control-btn clear">Clear</button>
      </div>

      {/* Sudoku board */}
      <div>
        <table className={isInvalidMove ? 'invalid-board' : ''}>
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`}>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={cell === 0 ? '' : cell}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={handleCheckSolution} className="check-solution">Check</button>

        {isSolutionValid === true && <p className="success-msg">✅ Congratulations! Solution is correct.</p>}
        {isSolutionValid === false && <p className="error-msg">❌ There are errors in your board.</p>}
      </div>
    </div>
  );
}
