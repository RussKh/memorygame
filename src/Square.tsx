import React from "react";
import { ISquare } from "./Board";
import "./AppCSS.css";

interface IProps {
  square: ISquare;
  openSquare: (id: number, img: string) => void;
}

const Square = (props: IProps) => {
  return (
    <div
      className={`square ${props.square.isOpen ? "flip" : ""}`}
      style={{ pointerEvents: props.square.pointerEnabled ? "auto" : "none" }}
      onClick={() => props.openSquare(props.square.id, props.square.img)}
    >
      <div className="inner">
        <div className="front">
          <img
            src={`${process.env.PUBLIC_URL}/images/back.jpg`}
            alt="Example from public"
          />
        </div>
        <div className="back">
          <img
            src={`${process.env.PUBLIC_URL}/images/${props.square.img}`}
            alt="Example from public"
          />
        </div>
      </div>
    </div>
  );
};

export default Square;
