import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AppCSS.css";
import Board from "./Board";
import { ButtonGroup } from "react-bootstrap";

function App() {
  const emoji = ["🐬", "🐍", "🏄", "⛵️", "🌺", "🌴"];
  const speedLevels = ["slow", "medium", "fast"];
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
  const [speed, setSpeed] = useState(speedLevels[1]);
  const [showBoardTimeout, setShowBoardTimeout] = useState(false);
  const [hideBoardTimeout, setHideBoardTimeout] = useState(false);
  const [gameResult, setGameResult] = useState(0);
  const [gameResultHistory, setGameResultHistory] = useState<number[]>([]);
  const [shouldFlashBoard, setShouldFlashBoard] = useState(false);

  const toggleFlashBoard = () => {
    setShouldFlashBoard((prev) => !prev);
  };

  useEffect(() => {
    fillBoard();
  }, []);

  useEffect(() => {
    if (showBoardTimeout) showBoard();
  }, [showBoardTimeout]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowBoardTimeout(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hideBoardTimeout) {
      hideBoard();
    }
  }, [hideBoardTimeout]);

  useEffect(() => {
    if (showBoardTimeout) {
      const timeout = setTimeout(() => {
        setHideBoardTimeout(true);
      }, 500); // Delay of 0.5 second (300 milliseconds)

      return () => clearTimeout(timeout);
    }
  }, [showBoardTimeout]);

  function showBoard() {
    setSquares(
      squares.map((sq) => ({ ...sq, isOpen: true, pointerEnabled: false }))
    );
  }

  function hideBoard() {
    setSquares(
      squares.map((sq) => ({ ...sq, isOpen: false, pointerEnabled: true }))
    );
    setHideBoardTimeout(false);
  }

  useEffect(() => {
    checkMove();
    checkFinish();
  }, [history]);

  function fillBoard() {
    const doubleEmoji = [...emoji, ...emoji].sort(() => Math.random() - 0.5);
    const newSquares = squares.map((el, index) => ({
      ...el,
      img: doubleEmoji[index],
    }));
    setSquares(newSquares);
  }

  function reshuffle() {
    gameResult > 0 && setGameResultHistory([gameResult, ...gameResultHistory]);
    toggleFlashBoard(); // Trigger the board flashing
    setGameResult(0);
    setHistory([]);
    setSquares(
      squares
        .map((sq) => ({ ...sq, isOpen: false, pointerEnabled: true }))
        .sort(() => Math.random() - 0.5)
    );
  }
  useEffect(() => {
    if (shouldFlashBoard) {
      showBoard();

      const timeout = setTimeout(() => {
        hideBoard();
        setShouldFlashBoard(false); // Reset the flag after flashing
      }, 500); // Flash duration: 500 milliseconds (0.5 seconds)

      return () => clearTimeout(timeout);
    }
  }, [shouldFlashBoard]);

  function flashSpeed() {
    let i = speedLevels.findIndex((level) => level === speed);
    setSpeed(speedLevels[(i + 1) % 3]);
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

  function checkMove() {
    if (
      history.length % 2 === 0 &&
      history[history.length - 1] !== history[history.length - 2]
    ) {
      setIsClickable(false);
      setTimeout(
        () => {
          const newSquares = squares.map((el) =>
            el.img === history[history.length - 1] ||
            el.img === history[history.length - 2]
              ? { ...el, isOpen: false, pointerEnabled: true }
              : el
          );
          setSquares(newSquares);
          setIsClickable(true);
        },
        speed === "fast" ? 300 : speed === "medium" ? 500 : 800
      );
    }
  }

  function checkFinish() {
    if (!squares.map((el) => el.isOpen).includes(false)) {
      setGameResult(history.length / 2);
    }
  }

  return (
    <>
      <div>
        <Board squares={squares} openSquare={openSquare} />
      </div>
      <ButtonGroup aria-label="Basic example">
        <Button variant="info" onClick={reshuffle}>
          Reshuffle
        </Button>
        <Button variant="success" onClick={flashSpeed}>
          Flash duration: {speed}
        </Button>
      </ButtonGroup>
      <div className="m-3">
        {!!gameResult && (
          <Button variant="outline-success"> Won in {gameResult} moves </Button>
        )}
        <h3>Last win scores:</h3>
        {gameResultHistory.map((res) => (
          <li>{res}</li>
        ))}
      </div>
    </>
  );
}

export default App;
