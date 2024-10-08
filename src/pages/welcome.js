import "../style/welcome.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGameContext } from "../logic/globalContext"; // import the constext to save the date
import { night, day, auto } from "../logic/theme";
// import dependecies of firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Welcome = () => {
  const [popup, setPopup] = useState(false);
  const { setPlayerName, score } = useGameContext(); // acces to use context by useGameContext()
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // code to import data from firebase
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresCollection = collection(db, "scores");
        const scoresSnapshot = await getDocs(scoresCollection);
        const scoreList = scoresSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScores(scoreList);
        console.log(scoreList);
      } catch (e) {
        setError("Error importing data");
        console.log("Errore durante il recupero dei punteggi", e);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;
  return (
    <main className="welcomeContainer">
      <div className="themeContainer" onClick={openPopup}>
        <button>Black</button>
        <button>White</button>
        <p>{score}</p>
      </div>
      <div>
        <h1>Welcome in Trivial Game</h1>
      </div>
      <div className="line">{/* empty, only to draw line */}</div>
      <section className="welcomeSection">
        <h2>Insert your name</h2>
        <input
          type="text"
          value={name}
          onChange={playerName}
          required
          maxLength={20}
        />
        <button className="btn" onClick={handleStart}>
          Start
        </button>
        {popup && (
          <div className="popupContainer">
            <button onClick={night}>NIGHT</button>
            <button onClick={auto}>AUTO</button>
            <button onClick={day}>DAY</button>
            <button onClick={closePopup}>chiudere</button>
          </div>
        )}
      </section>
      <section>
        <h2>Punteggi salvati</h2>
        {scores.map((el) => (
          <p key={el.id}>
            {el.name}: {el.category} punteggio: {el.score} / 10
          </p>
        ))}
      </section>
    </main>
  );
};

export default Welcome;
