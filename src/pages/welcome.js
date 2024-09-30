import "../style/welcome.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useGameContext } from "../logic/globalContext"; // import the constext to save the date

const Welcome = () => {
  const { setPlayerName } = useGameContext(); // acces to use context by useGameContext()
  const [name, setName] = useState("");

  // select the name of user
  const playerName = (event) => {
    setName(event.target.value);
  };

  //save the name in global context
  const handleStart = () => {
    setPlayerName(name); // svae the name in the context
  };

  return (
    <>
      <div>
        <h1>Welcome in Trivia Game</h1>
      </div>
      <section>
        <h2>Insert your name</h2>
        <input type="text" value={name} onChange={playerName} />

        <Link to="/difficulty">
          <button onClick={handleStart}>Start</button>
        </Link>
      </section>
    </>
  );
};

export default Welcome;
