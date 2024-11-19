// import { useState } from "react";

import "../style/popupGame.css";
import React, { useState } from "react";

// to save in Firebase database NoSql
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useGameContext } from "../logic/globalContext";

const PopupGame = ({
  playerName,
  difficulty,
  category,
  score,
  congratulation,
  randomMode,
}) => {
  const { setPlayerName } = useGameContext(); // code to change name in Global context
  const [newNeme, setNewName] = useState(""); // state to save new name

  // function to control edit name
  const handleInputNewName = (e) => {
    const input = e.target.value.toUpperCase();
    if (input.length <= 15) {
      setNewName(input);
    }
  };
  // function to save new name in global context
  const handleChangeName = () => {
    setPlayerName(newNeme);
  };

  // FUNNCTION TO SAVE DATA IN NoSql Firebase
  const saveScore = async () => {
    try {
      await addDoc(collection(db, "scores"), {
        name: playerName,
        score: score,
        category: category,
        difficulty: difficulty,
        randomMode: randomMode,
        timestamp: new Date(),
      });
      alert("Your score has been saved");
    } catch (e) {
      console.error("Error during saving data", e);
    }
  };
  return (
    <div className="popupGameContainer">
      <h3>{congratulation}</h3>
      <h3>{playerName}</h3>
      {/* <h3>{difficulty}</h3> */}
      {/* <h3>{category}</h3> */}
      <h3>{score} out of 10 correct!</h3>
      <h3>Do you want to save your score?</h3>
      <button className="btnGeneral" onClick={saveScore}>
        Save and Publish
      </button>
      <p className="infoBeforeSave">
        Are you sure you want to publish using this name?
      </p>
      <p className="infoBeforeSave">
        If the name is deemed inappropriate, the administrator may delete your
        entry.
      </p>
      <div className="changeName">
        <input
          type="text"
          maxLength={15}
          value={newNeme}
          placeholder="Change name"
          onChange={handleInputNewName}
          // value={name}
        />
        <button className="btn" onClick={handleChangeName}>
          Confirm changes
        </button>
      </div>
    </div>
  );
};

export default PopupGame;
