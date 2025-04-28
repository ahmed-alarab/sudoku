import React, { useState } from "react";
import './Sudoku.css';

export default function Sudoku() {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );

  const [isInvalidMove, setIsInvalidMove] = useState(false);
  const [isSolutionValid, setIsSolutionValid] = useState<boolean | null>(null); // new state for solution check

  const isValidMove = (board: number[][], row: number, col: number, value: number) => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) {
        return false;
      }
    }
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) {
        return false;
      }
    }
    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          return false;
        }
      }
    }
    return true; // It's valid
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
    if (isNaN(newValue) || newValue < 1 || newValue > 9) {
      return;
    }

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

  return (
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

      <div style={{ marginTop: '10px' }}>
        <button onClick={handleCheckSolution} className="check-solution">Check Solution</button>
      </div>

      {isSolutionValid === true && (
        <p style={{ color: 'green', marginTop: '10px' }}>✅ Congratulations! Solution is correct.</p>
      )}
      {isSolutionValid === false && (
        <p style={{ color: 'red', marginTop: '10px' }}>❌ There are errors in your board.</p>
      )}
    </div>
  );
}
