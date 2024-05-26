import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AppCSS.css";
import Board from "./Board";
import Modal from "react-bootstrap/Modal";

function App() {
  const playingCards = [
    "2_of_clubs.png",
    "2_of_diamonds.png",
    "2_of_hearts.png",
    "2_of_spades.png",
    "10_of_clubs.png",
    "10_of_diamonds.png",
    "10_of_hearts.png",
    "10_of_spades.png",
    "ace_of_clubs.png",
    "ace_of_diamonds.png",
    "ace_of_hearts.png",
    "ace_of_spades.png",
    "jack_of_clubs2.png",
    "jack_of_diamonds2.png",
    "jack_of_hearts2.png",
    "jack_of_spades2.png",
    "king_of_clubs2.png",
    "king_of_diamonds2.png",
    "king_of_hearts2.png",
    "king_of_spades2.png",
    "queen_of_clubs2.png",
    "queen_of_diamonds2.png",
    "queen_of_hearts2.png",
    "queen_of_spades2.png",
    "red_joker.png",
  ];

  const initialSquares = new Array(12)
    .fill({
      id: 0,
      img: "",
      isOpen: false,
      pointerEnabled: false,
    })
    .map((el) => ({ ...el, id: Math.random() }));

  const [squares, setSquares] = useState(initialSquares);
  const [history, setHistory] = useState<string[]>([]);
  const [isClickable, setIsClickable] = useState(true);
  const [gameResult, setGameResult] = useState(0);
  const [gameResultHistory, setGameResultHistory] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [hideBoardTimeout, setHideBoardTimeout] = useState(false);
  const [shouldFlashBoard, setShouldFlashBoard] = useState(false);

  const toggleFlashBoard = () => setShouldFlashBoard((prev) => !prev);

  const [shouldDelayFlash, setShouldDelayFlash] = useState(false);

  const handleDelayFlash = () => {
    setShouldDelayFlash(true);
    const timeout = setTimeout(() => {
      toggleFlashBoard();
      setShouldDelayFlash(false);
    }, 0); // reshuffle timeout

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (hideBoardTimeout) {
      hideBoard();
    }
  }, [hideBoardTimeout]);

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

  function fillBoard() {
    setShowScore(false);
    const suitRandom = ["hearts", "diamonds", "clubs", "spades"][
      Math.floor(Math.random() * 4)
    ];
    const cardsArray = playingCards.filter((el) => el.includes(suitRandom));
    console.log(cardsArray);
    const doubleEmoji = [...cardsArray, ...cardsArray].sort(
      () => Math.random() - 0.5
    );
    const newSquares = squares.map((el, index) => ({
      ...el,
      img: doubleEmoji[index],
    }));
    setSquares(newSquares);
  }

  function reshuffle() {
    // if (gameResult > 0) {
    //   setGameResultHistory([gameResult, ...gameResultHistory]);
    // }
    // setGameResult(0);
    setHistory([]);
    setShowScore(false);
    hideBoard();
    setTimeout(() => {
      fillBoard();
      handleDelayFlash();
    }, 500);
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

  useEffect(() => {
    checkMove();
    checkFinish();
  }, [history]);

  function checkMove() {
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
      }, 500); //second card flip timeout
    }
  }

  function checkFinish() {
    if (squares.every((el) => el.isOpen)) {
      const currentResult = history.length / 2;
      setGameResult(currentResult);
      setGameResultHistory((prev) => [currentResult, ...prev]);
      setShowScore(true);
    }
  }

  return (
    <>
      <div>
        <div className="mb-5">
          <Button
            variant="dark"
            style={{ background: "brown", outline: "none" }}
            onClick={reshuffle}
          >
            {squares[0].img === "" ? "START" : "Reshuffle"}
          </Button>
        </div>
        <div>
          <Board squares={squares} openSquare={openSquare} />
        </div>

        <Modal
          contentClassName="custom-modal-content"
          size="sm"
          centered
          show={showScore}
          onHide={() => setShowScore(false)}
        >
          <Modal.Header className="custom-modal-header">
            <Modal.Title>Finished in {gameResult} moves</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Best score:{" "}
            {gameResultHistory.length > 0
              ? Math.min(...gameResultHistory)
              : gameResult}
          </Modal.Body>
          <Modal.Footer
            className="custom-modal-footer"
            style={{ cursor: "pointer" }}
            onClick={reshuffle}
          >
            Play again?
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default App;
