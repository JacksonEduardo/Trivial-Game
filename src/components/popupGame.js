import "../style/popupGame.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// to save in Firebase database NoSql
// import { collection, addDoc } from "firebase/firestore";
import {
  collection,
  addDoc,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";

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
  const [confirmSave, setConfirmSave] = useState(false);
  const [error, setError] = useState(null);

  const [positions, setPositions] = useState({
    infoSave: 0,
    saveMsg: 400,
    scoreList: 800,
  });

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
      // alert("Your score has been saved");
      setConfirmSave(true);
    } catch (e) {
      console.error("Error during saving data", e);
    }
  };

  // Gestione aggiornamento posizioni con `useEffect`
  useEffect(() => {
    if (confirmSave) {
      setPositions({ infoSave: -400, saveMsg: 0, scoreList: 400 });

      const timeout = setTimeout(() => {
        setPositions({ infoSave: -800, saveMsg: -400, scoreList: 0 });
      }, 3000);

      // Pulisce il timeout in caso di smontaggio del componente
      return () => clearTimeout(timeout);
    }
  }, [confirmSave]);

  // Codice per prendere i dati dal database
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, "scores");
        // catch only ten records
        const scoresQuery = query(
          scoresCollection,
          orderBy("score", "desc"),
          limit(10)
        );
        const scoresSnapshot = await getDocs(scoresQuery);
        const scoreList = scoresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // setScores(scoreList);
        console.log(scoreList);
      } catch (e) {
        setError("Error importing data");
        console.log("Error fetching scores", e);
      }
      // finally {
      //   setLoading(false);
      // }
    };
    fetchScores();
  }, []);

  const handleReplay = () => {
    window.location.reload();
  };

  if (error) return <p>{error}</p>;
  return (
    <div className="popupGameContainer">
      <div className="infoSavePopup" style={{ top: `${positions.infoSave}px` }}>
        <div className="topCard">
          <div className="scorePopup">
            <h2>{congratulation}</h2>
            <h4>{playerName}</h4>
          </div>
          <div>
            <h4>Do you want to save your score?</h4>
            <p className="infoBeforeSave">
              If the name is deemed inappropriate, the administrator may delete
              your game entry.
            </p>
          </div>
          <div className="changeNameContainer">
            <input
              type="text"
              maxLength={15}
              value={newNeme}
              placeholder="Change name"
              onChange={handleInputNewName}
              className="inputChangeName"
            />
            <button className="btn" onClick={handleChangeName}>
              Confirm name
            </button>
          </div>
        </div>
        <div className="centerCard">
          <div className="leftGame"></div>
          <div className="centerSaveBtn">
            <button
              className="btnGeneral"
              onClick={saveScore}
              disabled={confirmSave}
            >
              Save and Publish
            </button>
          </div>
          <div className="rightGame"></div>
        </div>
        <div className="bottomCard">
          <div>
            <button className="btn" onClick={handleReplay}>
              Try again
            </button>
            <Link className="noDecoration" to="/difficulty">
              <button className="btn">New match</button>
            </Link>
            <Link className="noDecoration" to={"/"}>
              <button className="btn">Home</button>
            </Link>
          </div>
        </div>
      </div>
      {/* SAVE MESSAGE CORRECT */}
      <div className="saveMsgPopup" style={{ top: `${positions.saveMsg}px` }}>
        <h1>Salvatagio corretto</h1>
      </div>

      {/* CLASSIFICA DEI PUNTEGGI E NAV */}
      <div
        className="scoreListPopup"
        style={{ top: `${positions.scoreList}px` }}
      >
        <h1>Lista punteggi</h1>

        <button className="btnGeneral">Home</button>
        <button className="btnGeneral">New match</button>
      </div>
    </div>

    // <div className="popupGameContainer">
    //   {/* SAVE SECTION */}
    //   <div className="infoSavePopup" style={{ top: `${positions.infoSave}px` }}>
    //     <h3>{congratulation}</h3>
    //     <h3>{playerName}</h3>
    //     {/* <h3>{difficulty}</h3> */}
    //     {/* <h3>{category}</h3> */}
    //     <h3>{score} out of 10 correct!</h3>
    //     <h3>Do you want to save your score?</h3>
    //     <div className="changeName">
    //       <input
    //         type="text"
    //         maxLength={15}
    //         value={newNeme}
    //         placeholder="Change name"
    //         onChange={handleInputNewName}
    //       />
    //       <button className="btn" onClick={handleChangeName}>
    //         Confirm name
    //       </button>
    //     </div>
    //     <div className="containerSave">
    //       <p className="infoBeforeSave">
    //         Are you sure you want to use this name?
    //       </p>
    //       <p className="infoBeforeSave">
    //         If the name is deemed inappropriate, the administrator may delete
    //         your game entry.
    //       </p>
    //       <button
    //         className="btnGeneral"
    //         onClick={saveScore}
    //         disabled={confirmSave}
    //       >
    //         Save and Publish
    //       </button>
    //     </div>
    //   </div>

    //   {/* SAVE MESSAGE CORRECT */}
    //   <div className="saveMsgPopup" style={{ top: `${positions.saveMsg}px` }}>
    //     <h1>Salvatagio corretto</h1>
    //   </div>

    //   {/* CLASSIFICA DEI PUNTEGGI E NAV */}
    //   <div
    //     className="scoreListPopup"
    //     style={{ top: `${positions.scoreList}px` }}
    //   >
    //     <h1>Lista punteggi</h1>

    //     <button className="btnGeneral">Home</button>
    //     <button className="btnGeneral">Replay</button>
    //   </div>
    // </div>
  );
};

export default PopupGame;
