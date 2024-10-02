import "../style/game.css";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name
import { useEffect, useState } from "react";
import axios from "axios";
import he from "he";

const Game = () => {
  const { playerName, difficulty, category } = useGameContext();
  const [data, setData] = useState([]);
  const [mixedData, setMixedData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [score, setScore] = useState(0);
  const [confirmedAnswers, setConfirmedAnswers] = useState([]);
  const [msgResult, setMsgResult] = useState([]); // create stato to use like a condition to see or not a componente card o message

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
  };

  console.log(selectedAnswer);

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
  };
  return (
    <main>
      <section>
        <h1>{playerName}</h1>
        <h1>{difficulty}</h1>
        <h1>{category.name}</h1>
        <h1>Are you ready?</h1>
        <button onClick={fetchDataQuestion}>Start!</button>

        {mixedData &&
          mixedData.map((el, index) => {
            return (
              <div className="card" key={index}>
                <h2>{el.question}</h2>
                {confirmedAnswers[index] && msgResult[index] === false && (
                  <h3>The correct answer was: {el.correct_answer}</h3>
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
                          onChange={() => handleAnswerSelection(index, answer)}
                          disabled={confirmedAnswers[index]}
                        />
                        <label htmlFor={`answer-${idx}`}>{answer}</label>
                      </div>
                    );
                  })}
                <button
                  onClick={() => checkAnswer(index, el.correct_answer)}
                  disabled={confirmedAnswers[index]}
                >
                  Confirm your test
                </button>
              </div>
            );
          })}
      </section>
      <p>{score}</p>
      <section>
        <h3>Do you want to save your score?</h3>
        <button>Save and Publish</button>
      </section>
    </main>
  );
};

export default Game;
