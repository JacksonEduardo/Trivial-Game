import "../style/game.css";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name
import { useEffect, useState } from "react";
import axios from "axios";
import he from "he";
import { PopupGame } from "../components";
// to save in Firebase database NoSql this code is used in popup component
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase";

const Game = () => {
  const { playerName, difficulty, category, randomMode } = useGameContext();
  const [data, setData] = useState([]);
  const [mixedData, setMixedData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [score, setScore] = useState(0);
  const [confirmedAnswers, setConfirmedAnswers] = useState([]);
  const [msgResult, setMsgResult] = useState([]); // create stato to use like a condition to see or not a componente card o message
  const [openPopup, setOpenPopup] = useState();
  const [disableBtn, setDisableBtn] = useState(true);
  const [cardGame, setCardGame] = useState(false);
  const [resultCongratulation, setResultCongratulation] = useState("");
  const [isAnswerSelected, setIsAnswerSelected] = useState([]); // code to check if anwser of every single question is selected
  // const [infoEnd, setInfoEnd] = useState(false); // state to open extra info

  // function to mix the answer
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };
  // code to fetch questions from API
  const fetchDataQuestion = async () => {
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${category.id}&difficulty=${difficulty}&type=multiple`
      );
      //   decode Html entities in questions
      const decodedQuestions = response.data.results.map((question) => {
        return {
          ...question,
          question: he.decode(question.question),
          correct_answer: he.decode(question.correct_answer),
          incorrect_answers: question.incorrect_answers.map((ans) =>
            he.decode(ans)
          ),
        };
      });
      setData(decodedQuestions);
      setDisableBtn(false);
      setTimeout(() => setCardGame(true), 100);
      console.log(decodedQuestions);
    } catch (error) {
      console.log("Error during fetching data with questions", error);
    }
  };

  // Mix the answers when data changes
  useEffect(() => {
    if (data.length > 0) {
      const mixedQuestions = data.map((ques) => {
        return {
          ...ques,
          mixedAnswers: shuffleArray([
            ...ques.incorrect_answers,
            ques.correct_answer,
          ]),
        };
      });
      setMixedData(mixedQuestions);
      setConfirmedAnswers(new Array(data.length).fill(false)); // set all questions to false
    }
  }, [data]);

  // code to check answer selection
  const handleAnswerSelection = (questionIndex, answer) => {
    setSelectedAnswer((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));

    // enable button if answer of question is selected
    setIsAnswerSelected((prevSelected) => {
      const newSelected = [...prevSelected];
      newSelected[questionIndex] = true;
      return newSelected;
    });
  };

  //   console.log(selectedAnswer);

  // let test = 10;
  // const testRandom = false;

  const checkAnswer = (questionIndex, correctAnswer) => {
    const selected = selectedAnswer[questionIndex];
    let result = selected === correctAnswer;
    if (result) {
      setScore((prevScore) => prevScore + 1);
    }

    // function to see if answer is incorrect
    setMsgResult((prev) => {
      const newMsgResult = [...prev];
      newMsgResult[questionIndex] = result;
      return newMsgResult;
    });

    // function to check if question it's yet confirm
    setConfirmedAnswers((prev) => {
      const newConfirmed = [...prev];
      newConfirmed[questionIndex] = true; // check the question like a confirmation
      console.log(newConfirmed);

      return newConfirmed;
    });

    // disable button after confirm answer
    setIsAnswerSelected((prevSelected) => {
      const newSelected = [...prevSelected];
      newSelected[questionIndex] = false; // change to false after confirm answer
      return newSelected;
    });
  };

  useEffect(() => {
    let popup = null;
    if (
      confirmedAnswers.length > 0 &&
      confirmedAnswers.every((answer) => answer === true)
    ) {
      popup = true;
    }
    setOpenPopup(popup);
  }, [confirmedAnswers]);

  // ----------------------------
  // * Without useEffect Too many renders error
  useEffect(() => {
    if (openPopup) {
      if (score === 0) {
        setResultCongratulation("No COMMENT! 0");
        console.log("No COMMENT! 0");
      } else if (score === 10 && randomMode === true) {
        setResultCongratulation("You're a MASTER of Trivial Game!");
        console.log("You're a MASTER of Trivial Game!");
      } else if (score > 0 && score <= 3) {
        setResultCongratulation("Back to school 0 - 3");
        console.log("back to school 0 - 3");
      } else if (score >= 3 && score <= 6) {
        setResultCongratulation("You need more general culture 3 - 6");
        console.log("You need more general culture 3 - 6");
      } else if (score >= 6 && score <= 8) {
        setResultCongratulation("Good job! 6 - 8");
        console.log("Good job! 6 - 8");
      } else if (score === 9) {
        console.log("GOOD GOOD JOB! 9");
        setResultCongratulation("GOOD DOOD JOB! 9");
      } else if (score === 10 && randomMode === false) {
        console.log("GOOD JOB TOP! 10/10");
        setResultCongratulation("GOOD JOB! 10/10");
      }
    }
  }, [openPopup, score, randomMode]);
  // --------------------------------

  // FUNNCTION TO SAVE DATA IN NoSql Firebase( this function is in popup component)
  // const saveScore = async () => {
  //   try {
  //     await addDoc(collection(db, "scores"), {
  //       name: playerName,
  //       score: score,
  //       category: category.name,
  //       difficulty: difficulty,
  //       timestamp: new Date(),
  //     });
  //     alert("Your score has been saved");
  //   } catch (e) {
  //     console.error("Error during saving data", e);
  //   }
  // };

  return (
    <main className="globalContainerGame">
      {/* popup to have information about match */}
      {openPopup && (
        <div className="popup">
          {/* {randomMode && <h1>Random mode </h1>} */}
          {/* <h4>{resultCongratulation}</h4>
          <h1>{playerName}</h1> */}
          {/* <h3>{difficulty}</h3> */}
          {/* <h3>{category.name}</h3> */}
          {/* <p>{score} out of 10 correct!</p>
          <h3>Do you want to save your score?</h3>
          <button className="btnGeneral" onClick={saveScore}>
            Save and Publish
          </button>
          <p className="infoBeforeSave">
            Are you sure you want to publish with this name?
          </p>
          <p className="infoBeforeSave">
            If the name is not appropriate, the administrator may delete your
            match
          </p> */}
          <PopupGame
            playerName={playerName}
            difficulty={difficulty}
            category={category.name}
            score={score}
            congratulation={resultCongratulation}
            randomMode={randomMode}
          ></PopupGame>
        </div>
      )}
      {/* {!openPopup && (
        <div className="testPopup">
          <h1>informazioni a popup chiuso</h1>
        </div>
      )} */}
      <section className="allContainerGame">
        {disableBtn && (
          <div className="bannerSelections">
            {/* {randomMode && <h1>Random mode </h1>} */}
            {/* <p>{score} answer correct out of 10</p> */}
            <div>
              <h1>Here we go&nbsp;</h1>
              <h1>{randomMode}</h1>
              <p className="nameInsideCardGame">{playerName}!</p>
            </div>
            <div className="bgCatLevGame">
              <h3 className="catLevelGame">{category.name}</h3>
              <h3 className="catLevelGame">Level:&nbsp;{difficulty}</h3>
            </div>
            {/* THE STYLE OF GENIUS BUTTON and NORMAL BUTTON are in APP.CSS (to do: button component) */}
            <div className={randomMode ? "btnAndRotation" : ""}>
              <div className={randomMode ? "btnRotation" : ""}>
                {/* empty only to use rotation effect */}
              </div>
              <button
                className={randomMode ? "btnGeniusNoLamp" : "btnGeneral"}
                onClick={fetchDataQuestion}
              >
                {randomMode ? "Start Random Mode!" : "Start!"}
              </button>
            </div>
          </div>
        )}
        <div className="cardContainer">
          {mixedData &&
            mixedData.map((el, index) => {
              return (
                <div
                  // className="cardViewGame"
                  className={`cardHidenGame ${cardGame && "cardViewGame"}`}
                  key={index}
                >
                  <h2 className="answerGame">{el.question}</h2>
                  {confirmedAnswers[index] && msgResult[index] === false && (
                    <h3>Correct answer: {el.correct_answer}</h3>
                  )}
                  {el.mixedAnswers &&
                    el.mixedAnswers.map((answer, idx) => {
                      return (
                        <div key={idx}>
                          <input
                            type="radio"
                            id={`answer-${idx}`}
                            name={`question-${index}`}
                            value={answer}
                            onChange={() =>
                              handleAnswerSelection(index, answer)
                            }
                            disabled={confirmedAnswers[index]}
                          />
                          <label htmlFor={`answer-${idx}`}>{answer}</label>
                        </div>
                      );
                    })}

                  <button
                    className="btn"
                    onClick={() => checkAnswer(index, el.correct_answer)}
                    disabled={
                      !isAnswerSelected[index] || confirmedAnswers[index]
                    }
                  >
                    Confirm answer
                  </button>
                </div>
              );
            })}
        </div>
      </section>
    </main>
  );
};

export default Game;
