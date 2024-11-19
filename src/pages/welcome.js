import "../style/welcome.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useGameContext } from "../logic/globalContext";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { ScoreList } from "../components";

const Welcome = () => {
  // const [popup, setPopup] = useState(false);
  const { setPlayerName } = useGameContext();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  // const [scores, setScores] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animation, setAnimation] = useState(true);
  // const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState(false);

  const playerName = (event) => {
    const input = event.target.value.toUpperCase();
    if (input.length <= 15) {
      setName(input);
    }
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

  setTimeout(() => {
    setAnimation(false);
  }, 3000);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // code to open score list

  // this method is used only when have only one btn action
  // function openClose() {
  //   setIsOpen((prev) => !prev);
  //   console.log("click per aprire");
  // }

  return (
    <main className="welcomeContainer">
      {/* mascotte animation */}
      <div
        className={`mascotteAlert ${
          msg ? "mascotteAlertView" : "mascotteAlertHidden"
        }`}
      >
        <div className="msgMascotteBanner">
          <p>Please enter your name</p>
        </div>
      </div>
      {/* cards animation */}
      <div className="cardWelcomeContainer">
        <div className="cardWelcome Four"></div>
        <div className="cardWelcome Three"></div>
        <div className="cardWelcome Two"></div>
        <div className="cardWelcome One"></div>
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
        <div className={`test2 ${animation ? "" : "nameInputContainer"}`}>
          {!animation && (
            <>
              <input
                className="nameInput"
                type="text"
                value={name}
                onChange={playerName}
                required
                placeholder="Insert your name"
                maxLength={15}
              />
              <button className="btnGeneral" onClick={handleStart}>
                Start
              </button>
            </>
          )}
        </div>
      </section>
      <ScoreList></ScoreList>
    </main>
  );
};

export default Welcome;

// {loading ? (
//   <p>Loading</p>
// ) : (
//   <section
//     className={`scoreList ${isOpen ? "scoreListOpen" : "scoreListClose"}`}
//     onClick={openClose}
//   >
//     <div className="openCloseList">
//       {/* empty, only to contein icon to close and open */}
//     </div>
//     <div className="btnTitleTable">
//       <h2>Best Scores</h2>
//       {scores.map((el) => (
//         <div key={el.id} className="infoScoreContainer">
//           <h3 className="nameUser">{el.name}</h3>
//           <div className="dataUser">
//             <div className="categoryInfo">
//               <p>{el.category}</p>
//             </div>
//             <div className="dificultyInfo">
//               <p>{el.difficulty}</p>
//             </div>
//             <div className="scoreInfo">
//               <p>{el.score}/10</p>
//               <p>{el.randomMode ? el.score + 2 : ""}</p>
//             </div>
//             <div className="geniousInfo">
//               <p>{el.randomMode ? "Random mode +2pts" : "Normal mode"}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </section>
// )}
