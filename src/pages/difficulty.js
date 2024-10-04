import "../style/difficulty.css";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name
import { useState, useEffect } from "react";
import axios from "axios";

const Difficulty = () => {
  const {
    playerName,
    setDifficulty,
    setCategory,
    difficulty,
    category,
    setRandomMode,
  } = useGameContext(); // acces to the name
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // code to fetch API to have category and difficulty
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://opentdb.com/api_category.php"
        );
        setData(response.data.trivia_categories);
        console.log(response.data.trivia_categories);
      } catch (error) {
        console.log("Error during fetch data", error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  // reset values when come back in Difficulty "page"
  useEffect(() => {
    setDifficulty("");
    setCategory({ id: "", name: "" });
  }, [setCategory, setDifficulty]);

  // code to save Difficulty and category in global context
  const handleDifficultySelect = (event) => {
    setDifficulty(event.target.value);
  };
  const handleCategorySelect = (event) => {
    const selectedCategory = data.find(
      (el) => el.id === parseInt(event.target.value)
    );
    setCategory({
      id: selectedCategory.id,
      name: selectedCategory.name,
    });
  };

  const handleStartGame = () => {
    if (category && difficulty) {
      // Nav only if are selected category and difficulty
      navigate("/game");
    } else {
      alert("Please select both a category and a difficulty level.");
    }
    setRandomMode(false);
  };

  // code to save in global context when select random mode
  const random = () => {
    // CATEGORY WITH RANDOM NUMBER
    const randomNumber = Math.floor(Math.random() * (32 - 9 + 1) + 9);
    console.log(randomNumber);
    const selectedCategoryRandom = data.find((el) => el.id === randomNumber);
    // set random categories with number
    setCategory({
      id: selectedCategoryRandom.id,
      name: selectedCategoryRandom.name,
    });
    console.log(category);

    // DIFFICULTY RANDOM
    const difficulties = ["easy", "medium", "hard"];
    const randomDifficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    console.log(randomDifficulty);

    // set random difficulty
    setDifficulty(randomDifficulty);
    console.log(difficulty);

    // Set Random mode in global context to mix with score
    setRandomMode(true);

    navigate("/game");
    return { randomNumber, randomDifficulty };
  };

  return (
    <>
      <p>Cool</p>
      <h3>{playerName}</h3>
      <p>Select your challenge</p>
      <main>
        <h1>Select difficult level</h1>
        <select value={category.id} onChange={handleCategorySelect}>
          <option value="" disabled>
            Select Category
          </option>
          {data &&
            data.map((el) => {
              return (
                <option value={el.id} key={el.id}>
                  {el.name}
                </option>
              );
            })}
        </select>
        <select value={difficulty} onChange={handleDifficultySelect}>
          <option value="" disabled>
            Select Difficulty
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="btn" onClick={handleStartGame}>
          Enjoy the game
        </button>
        <section>
          <h2>Do you want to try random mode?</h2>
          <button onClick={random}>Yess, I'm a Genious</button>
        </section>
      </main>
    </>
  );
};

export default Difficulty;
