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
  const [animation, setAnimation] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState(false);

  const playerName = (event) => {
    setName(event.target.value.toUpperCase());
  };

  const handleStart = () => {
    if (name.trim() !== "") {
      setPlayerName(name);
      navigate("/difficulty");
    } else {
      setMsg(true);
      // alert("Please insert your name to continue");
      setTimeout(() => {
        setMsg(false);
      }, 3000);
    }
  };

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
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  setTimeout(() => {
    setAnimation(false);
  }, 2000);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // code to open score list

  // this method is used only when have only one btn action
  function openClose() {
    setIsOpen((prev) => !prev);
    console.log("click per aprire");
  }

  return (
    <main className="welcomeContainer">
      <div className="cardWelcomeContainer">
        <div className="cardWelcome Four"></div>
        <div className="cardWelcome Three"></div>
        <div className="cardWelcome Two"></div>
        <div className="cardWelcome One"></div>
      </div>
      <div className={`msgAlert ${msg ? "msgAlertOpen" : "msgAlertClose"}`}>
        <p>Please enter your name</p>
      </div>
      <section className="welcomeSection">
        <div className="titleUpDown">
          {animation ? (
            <div className="circleContainer">
              <div className="circleOne"></div>
              <div className="circleTwo"></div>
              <div className="circleThree"></div>
              <div className="circleFour"></div>
            </div>
          ) : null}
          <div className="titleUp">
            <h1>Trivial</h1>
          </div>
          <div className="titleDown">
            {animation ? <div className="lineFlash"></div> : null}
            {!animation && <h1 className="hiddenE">e</h1>}
            <h1>Gam</h1>
          </div>
        </div>
        <div className="nameInputContainer">
          {!animation && (
            <>
              <input
                className="nameInput"
                type="text"
                value={name}
                onChange={playerName}
                required
                maxLength={20}
              />
              <button className="btnNameInput" onClick={handleStart}>
                Start
              </button>
            </>
          )}
        </div>
      </section>
      {loading ? (
        <p>Loadgin</p>
      ) : (
        <section
          className={`scoreList ${isOpen ? "scoreListOpen" : "scoreListClose"}`}
          onClick={openClose}
        >
          <div className="btnTitleTable">
            <div className="openCloseList"></div>
            <h2>Best Scores</h2>
            {scores.map((el) => (
              <div>
                <h3>{el.name}</h3>
                <div>
                  <p>{el.category}</p>
                  <p>{el.score}</p>
                </div>
              </div>
            ))}

            {/* <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((el) => (
                  <tr key={el.id}>
                    <td>{el.name}</td>
                    <td>
                      <p>{el.category}</p>
                    </td>
                    <td>{el.score} / 10</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </section>
      )}
    </main>
  );
};

export default Welcome;
