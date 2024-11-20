import "../style/game.css";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name
import { useEffect, useState } from "react";
import axios from "axios";
import he from "he";
import { PopupGame, ScoreList } from "../components";

const Game = () => {
  const { playerName, difficulty, category, randomMode, theme } =
    useGameContext();
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
  const [visibility, setVisibility] = useState(false); // code to apply visibility in btn confirm

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
      // decode Html entities in questions
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
      setTimeout(() => setVisibility(true), 1000);
      // console.log(decodedQuestions);
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
      // console.log(newConfirmed);

      // console.log(newConfirmed);
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

  return (
    <>
      <main
        className={`globalContainerGame ${
          theme === "light" ? "bgGlobalWhite" : "bgGlobalBlack"
        } `}
      >
        {/* popup to have information about match */}
        {openPopup && (
          // <div className="popup">
          <PopupGame
            playerName={playerName}
            difficulty={difficulty}
            category={category.name}
            score={score}
            congratulation={resultCongratulation}
            randomMode={randomMode}
          ></PopupGame>
          // </div>
        )}
        <section className="allContainerGame">
          {disableBtn && (
            <div className="bannerSelections">
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
                    className={`cardHidenGame ${cardGame && "cardViewGame"} ${
                      visibility && "visibility"
                    }`}
                    key={index}
                  >
                    <h3 className="TitleAnswerGame">{el.question}</h3>

                    {/* Banner wrong answer */}
                    {confirmedAnswers[index] && msgResult[index] === false && (
                      <div className="colorWrong bannerResult">
                        <h3>Correct answer: {el.correct_answer}</h3>
                      </div>
                    )}

                    {/* Banner correct answer */}
                    {confirmedAnswers[index] && msgResult[index] !== false && (
                      <div className="colorCorrect bannerResult">
                        <h2>Good Job!</h2>
                      </div>
                    )}
                    <div className="answerAndBtnConfirm">
                      {el.mixedAnswers &&
                        el.mixedAnswers.map((answer, idx) => {
                          const isChecked = selectedAnswer[index] === answer;
                          return (
                            <div
                              key={idx}
                              className={`answerRadio ${
                                isChecked ? "checked" : ""
                              }`}
                              onClick={() =>
                                handleAnswerSelection(index, answer)
                              }
                            >
                              <div className="custom-radio">
                                {isChecked && <div className="radio-dot" />}
                              </div>
                              <span className="label">{answer}</span>
                            </div>
                          );
                        })}
                    </div>
                    {!confirmedAnswers[index] && (
                      <button
                        className={`btnConfirmAnswerHiden ${
                          cardGame && "btnConfirmAnswerView"
                        }`}
                        onClick={() => checkAnswer(index, el.correct_answer)}
                        disabled={
                          !isAnswerSelected[index] || confirmedAnswers[index]
                        }
                      >
                        Confirm answer
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
        <ScoreList></ScoreList>
      </main>
    </>
  );
};

export default Game;
