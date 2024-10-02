import "../style/welcome.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useGameContext } from "../logic/globalContext"; // import the constext to save the date
import { night, day, auto } from "../logic/theme";
const Welcome = () => {
  const [popup, setPopup] = useState(false);
  const { setPlayerName } = useGameContext(); // acces to use context by useGameContext()
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // select the name of user
  const playerName = (event) => {
    setName(event.target.value.toLocaleUpperCase());
  };

  //save the name in global context
  const handleStart = () => {
    if (name.trim() !== "") {
      setPlayerName(name); // save the name in the context
      navigate("/difficulty");
    } else {
      alert("please insert your name to continue");
    }
  };

  // function to open and close popup
  const openPopup = () => {
    setPopup(true);
    console.log("premuto per aprire");
  };
  const closePopup = () => {
    setPopup(false);
    console.log("premuto per chiudere");
  };

  return (
    <main className="welcomeContainer">
      <div className="themeContainer" onClick={openPopup}>
        <button>Black</button>
        <button>White</button>
      </div>
      <div>
        <h1>Welcome in Trivial Game</h1>
      </div>
      <section className="welcomeSection">
        <h2>Insert your name</h2>
        <input
          type="text"
          value={name}
          onChange={playerName}
          required
          maxLength={20}
        />
        <button onClick={handleStart}>Start</button>
        {popup && (
          <div className="popupContainer">
            <button onClick={night}>NIGHT</button>
            <button onClick={auto}>AUTO</button>
            <button onClick={day}>DAY</button>
            <button onClick={closePopup}>chiudere</button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Welcome;
