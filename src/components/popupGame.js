// import { useState } from "react";

import "../style/popupGame.css";
// to save in Firebase database NoSql
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const PopupGame = ({
  playerName,
  difficulty,
  category,
  score,
  congratulation,
}) => {
  //   const [saveMsg, setSaveMsg] = useState("Salva e condividi");

  // FUNNCTION TO SAVE DATA IN NoSql Firebase
  const saveScore = async () => {
    try {
      await addDoc(collection(db, "scores"), {
        name: playerName,
        score: score,
        category: category,
        difficulty: difficulty,
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
      <h3>{difficulty}</h3>
      <h3>{category}</h3>
      <h3>{score}</h3>
      <button onClick={saveScore}>Salva</button>
    </div>
  );
};

export default PopupGame;
