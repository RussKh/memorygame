import React, { useEffect, useState } from "react";
import "./App.css";
import Board from "./Board";

function App() {
  const emoji = ["🐬", "🐍", "🏄", "⛵️", "🌺", "🌴"];

  const initialSquares = new Array(12)
    .fill({
      id: 0,
      img: "",
      isOpen: false,
      pointerEnabled: true,
    })
    .map((el) => ({ ...el, id: Math.random() }));

  const [squares, setSquares] = useState(initialSquares);
  const [history, setHistory] = useState<string[]>([]);
  const [isClickable, setIsClickable] = useState(true);

  useEffect(() => {
    fillBoard();
  }, []);

  useEffect(() => {
    checkMove();
  }, [history]);

  function fillBoard() {
    const doubleEmoji = [...emoji, ...emoji].sort(() => Math.random() - 0.5);

    const newSquares = squares.map((el, index) => ({
      ...el,
      img: doubleEmoji[index],
    }));
    setSquares(newSquares);
  }

  function openSquare(id: number, img: string) {
    if (isClickable) {
      const newSquares = squares.map((el) =>
        el.id === id ? { ...el, isOpen: true, pointerEnabled: false } : el
      );
      setHistory([...history, img]);
      setSquares(newSquares);
    }
  }
  console.log(history);

  function checkMove() {
    // checks for last two images open

    if (
      history.length % 2 === 0 &&
      history[history.length - 1] !== history[history.length - 2]
    ) {
      setIsClickable(false);
      setTimeout(() => {
        const newSquares = squares.map((el) =>
          el.img === history[history.length - 1] ||
          el.img === history[history.length - 2]
            ? { ...el, isOpen: false, pointerEnabled: true }
            : el
        );
        setSquares(newSquares);
        setIsClickable(true);
      }, 600);
    }
  }

  return (
    <div className="App">
      <Board squares={squares} openSquare={openSquare} />
    </div>
  );
}

export default App;
