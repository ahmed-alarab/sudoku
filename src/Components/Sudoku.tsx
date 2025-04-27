import React,{useState} from "react";
import './Sudoku.css'

export default function Sudoku() {


    const [btn1, setBtn1] = useState("");
    const [btn2, setBtn2] = useState("");
    const [btn3, setBtn3] = useState("");
    const [btn4, setBtn4] = useState("");
    const [btn5, setBtn5] = useState("");
    const [btn6, setBtn6] = useState("");
    const [btn7, setBtn7] = useState("");
    const [btn8, setBtn8] = useState("");
    const [btn9, setBtn9] = useState("");



    const nextValue = () => {

    }
    return (
        <div>
            <table>


                <tr>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                </tr>


                <tr>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                </tr>


                <tr>
                    
                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                    <td><input type="number"
          min="1"
          max="9"
          defaultValue=""/></td>

                </tr>


            </table>
        </div>
    );
};
