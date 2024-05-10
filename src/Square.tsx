import React from "react";
import { ISquare } from "./Board";

interface IProps {
  square: ISquare;
  openSquare: (id: number, img: string) => void;
}

const Square = (props: IProps) => {
  // const pointer: React.CSSProperties["pointerEvents"] = props.square.pointer

  return (
    <div
      className="square"
      // style={{ pointerEvents: pointer }}
      onClick={() => props.openSquare(props.square.id, props.square.img)}
      // to avoid any mistakes so the function is called on only on click
    >
      {props.square.isOpen && props.square.img}
    </div>
  );
};

export default Square;
