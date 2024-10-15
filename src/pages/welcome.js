import "../style/welcome.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
// import { Navbar } from "../components";
import { useGameContext } from "../logic/globalContext";
// import { night, day, auto } from "../logic/theme";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Welcome = () => {
  // const [popup, setPopup] = useState(false);
  const { setPlayerName } = useGameContext();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playerName = (event) => {
    setName(event.target.value.toUpperCase());
  };

  const handleStart = () => {
    if (name.trim() !== "") {
      setPlayerName(name);
      navigate("/difficulty");
    } else {
      alert("Please insert your name to continue");
    }
  };

  // const openPopup = () => setPopup(true);
  // const closePopup = () => setPopup(false);

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
        console.log("Error fetching scores", e);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="welcomeContainer">
      <section className="welcomeSection">
        <div>
          <h1 className="titleWelcome">Trivial Game</h1>
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
        </div>
      </section>
      <section>
        <h2>Saved Scores</h2>
        {scores.map((el) => (
          <p key={el.id}>
            {el.name}: {el.category} Score: {el.score} / 10
          </p>
        ))}
      </section>
    </main>
  );
};

export default Welcome;
