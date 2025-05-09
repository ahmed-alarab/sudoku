import React, { useState,useEffect } from "react";
import './Sudoku.css';
import Tesseract from "tesseract.js";

declare global {
  interface Window {
    cv: any;
  }
}





export default function Sudoku() {


  useEffect(() => {
    const checkOpenCV = setInterval(() => {
      if (window.cv && window.cv.imread) {
        clearInterval(checkOpenCV);
        setCvReady(true);
        console.log("✅ OpenCV.js is ready!");
      }
    }, 100);

    return () => clearInterval(checkOpenCV);
  }, []);
  
  const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [isInvalidMove, setIsInvalidMove] = useState(false);
  const [isSolutionValid, setIsSolutionValid] = useState<boolean | null>(null);
  const [cvReady, setCvReady] = useState(false);

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

  const solveSudoku = (b: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(b, row, col, num)) {
              b[row][col] = num;
              if (solveSudoku(b)) return true;
              b[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = () => {
    const copy = board.map(row => [...row]);
    if (solveSudoku(copy)) {
      setBoard(copy);
      setIsInvalidMove(false);
      setIsSolutionValid(true);
    }
  };

  const handleHint = () => {
    const copy = board.map(row => [...row]);
    const solved = board.map(row => [...row]);
    if (solveSudoku(solved)) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (copy[row][col] === 0) {
            copy[row][col] = solved[row][col];
            setBoard(copy);
            return;
          }
        }
      }
    }
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


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const imageUrl = URL.createObjectURL(file);
  
    const { data } = await Tesseract.recognize(imageUrl, 'eng', {
      logger: m => console.log(m)
    });
  
    console.log('OCR Output:', data.text);
    const rawText = data.text.replace(/[^0-9]/g, ''); // keep only digits
if (rawText.length >= 81) {
  const parsedBoard: number[][] = [];
  for (let i = 0; i < 9; i++) {
    parsedBoard.push([]);
    for (let j = 0; j < 9; j++) {
      parsedBoard[i].push(parseInt(rawText[i * 9 + j], 10));
    }
  }
  setBoard(parsedBoard);
} else {
  alert("❌ Couldn't detect a full Sudoku board. Try a clearer image.");
}

  };
  

  return (
    <div className="sudoku-container">
      <div className="sidebar">
        <button onClick={loadEasyPuzzle} className="control-btn easy">Easy</button>
        <button onClick={loadMediumPuzzle} className="control-btn medium">Medium</button>
        <button onClick={loadHardPuzzle} className="control-btn hard">Hard</button>
        <button onClick={clearBoard} className="control-btn clear">Clear</button>
        <button onClick={handleSolve} className="control-btn solve">Solve</button>
        <button onClick={handleHint} className="control-btn hint">Hint</button>
      </div>

      <div>
        <table className={isInvalidMove ? 'invalid-board' : ''}>
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`}>
                  <input
  type="text"
  maxLength={1}
  inputMode="numeric"
  pattern="[1-9]"
  value={cell === 0 ? '' : cell}
  onChange={(e) => {
    const val = e.target.value;
    if (/^[1-9]?$/.test(val)) {
      handleInputChange(rowIndex, colIndex, val);
    }
  }}
  onKeyPress={(e) => {
    if (!/[1-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}
/>
                </td>
                
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={handleCheckSolution} className="check-solution">Check</button>
        <br>
        </br>
        <br>
        </br>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      {cvReady ? <p>OpenCV is ready to use!</p> : <p>Loading OpenCV...</p>}


        {isSolutionValid === true && <p className="success-msg">✅ Congratulations! Solution is correct.</p>}
        {isSolutionValid === false && <p className="error-msg">❌ There are errors in your board.</p>}
      </div>

      <div>
      {cvReady ? <p>OpenCV is ready to use!</p> : <p>Loading OpenCV...</p>}
    </div>
    </div>
  );
}
