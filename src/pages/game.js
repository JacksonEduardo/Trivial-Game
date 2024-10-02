import "../style/game.css";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name
import { useEffect, useState } from "react";
import axios from "axios";
import he from "he";

const Game = () => {
  const { playerName, difficulty, category } = useGameContext();
  const [data, setData] = useState([]);
  const [mixedData, setMixedData] = useState([]);

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
    }
  }, [data]);

  console.log(mixedData); // Debugging line

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
                {el.mixedAnswers &&
                  el.mixedAnswers.map((answer, idx) => {
                    return (
                      <div key={idx}>
                        <input
                          type="radio"
                          id={`answer-${idx}`}
                          name={`question-${index}`}
                        />
                        <label htmlFor={`answer-${idx}`}>{answer}</label>
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </section>
      <section>
        <h3>Do you want to save your score?</h3>
        <button>Save and Publish</button>
      </section>
    </main>
  );
};

export default Game;
