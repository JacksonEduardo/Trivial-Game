import "../style/scoreList.css";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const ScoreList = () => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // this method is used only when have only one btn action
  function openClose() {
    setIsOpen((prev) => !prev);
    console.log("click per aprire");
  }

  if (error) return <p>{error}</p>;

  return loading ? (
    <p>Loading</p>
  ) : (
    <section
      className={`scoreList ${isOpen ? "scoreListOpen" : "scoreListClose"}`}
      onClick={openClose}
    >
      <div className="openCloseList">
        {/* empty, only to contein icon to close and open */}
      </div>
      <div className="btnTitleTable">
        <h2>Best Scores</h2>
        {scores.map((el) => (
          <div key={el.id} className="infoScoreContainer">
            <h3 className="nameUser">{el.name}</h3>
            <div className="dataUser">
              <div className="categoryInfo">
                <p>{el.category}</p>
              </div>
              <div className="dificultyInfo">
                <p>{el.difficulty}</p>
              </div>
              <div className="scoreInfo">
                <p>{el.score}/10</p>
                <p>{el.randomMode ? el.score + 2 : ""}</p>
              </div>
              <div className="geniousInfo">
                <p>{el.randomMode ? "Random mode +2pts" : "Normal mode"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScoreList;
