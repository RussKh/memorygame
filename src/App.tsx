import React, {useEffect, useState} from 'react';
import './App.css';
import Board from "./Board";





function App() {

  const emoji = ['🐬', '🐍', '🏄', '⛵️', '🌺', '🌴'];

  const initialSquares = new Array(12).fill(
      {
        id: 0,
        img: '',
        isOpen: false
      }).map(el => ({...el, id: Math.random() }) );


  const [squares, setSquares] = useState(initialSquares);
  const [history, setHistory] = useState<string[]>([]);
// generic <> types of array, objects that the function gets, specifically for typescript
  useEffect(() => {
    fillBoard()
  }, [])

  useEffect(() => {
    checkMove()
  }, [history]);


  function fillBoard(){
    const doubleEmoji = [...emoji,...emoji]
        .sort(() => Math.random() - 0.5);
    // using - 0.5 in sort method is necessary, because this method is originally
    //comparing the values of each element
    // by subtracting 0.5 you can either get a negative or positive
    //number, so when sorting it randomly sorts negative and positive
    //values with equal amount of options

    const newSquares = squares.map((el, index) =>
        ({...el, img: doubleEmoji[index]}));
    setSquares(newSquares);

    // cleans the whole array to omit when it is checking for the second time in the strict mode
    // for (let i=0; i< doubleEmoji.length; i++) {
    //     let randomIndex;
    //     do {
    //         randomIndex = Math.floor(Math.random() * doubleEmoji.length);
    //     } while (newSquares[randomIndex].img !== '');
    //
    //     newSquares[randomIndex].img = doubleEmoji[i];
    // }

  }


  function openSquare(id: number, img: string){
    const newSquares = squares.map(
        el => el.id === id ? {...el, isOpen: true}: el
    );

    setHistory([...history, img])


    setSquares(newSquares);
  }
  console.log(history)

  function checkMove(){       // checks for last two images open
    if(history.length % 2 === 0 &&
        history[history.length-1] !== history[history.length-2]){
      setTimeout(()=>{

        const newSquares = squares.map(
            el => el.img === history[history.length-1] ||
            el.img === history[history.length-2]
                ? {...el, isOpen: false}
                : el
        )
        setSquares(newSquares);

      }, 600)

    }

  }

// 1- img is clickable more than 2 times and pushed into the history array
// 2- img that are open are clickable too



  return (
      <div className="App">

        <Board
            squares={squares}
            openSquare={openSquare}
        />

      </div>
  );
}

export default App;