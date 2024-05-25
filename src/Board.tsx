import React from "react";
import Square from "./Square";
import "./AppCSS.css";

export interface ISquare {
  id: number;
  img: string;
  isOpen: boolean; // --> typology of each square
  pointerEnabled: boolean;
}

interface IProps {
  squares: ISquare[];
  openSquare: (id: number, img: string) => void; //--> typology of the whole array for table
}

const Board = (props: IProps) => {
  return (
    <div className="board">
      {props.squares.map((square) => (
        <Square key={square.id} square={square} openSquare={props.openSquare} />
      ))}
    </div>
  );
};

export default Board;
