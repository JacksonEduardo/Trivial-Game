import "../style/difficulty.css";
import { Link } from "react-router-dom";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name
import { useState, useEffect } from "react";
import axios from "axios";

const Difficulty = () => {
  const { playerName } = useGameContext(); // acces to the name
  const [data, setData] = useState([]);

  // code to fetch API to have category and difficulty

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://opentdb.com/api_category.php"
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error during fetch data", Error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>{playerName}</h1>
      <main>
        <h1>Select dificult level</h1>
        <select>
          {data.trivia_categories &&
            data.trivia_categories.map((el) => {
              return (
                <option value="" key={el.id}>
                  {el.name}
                </option>
              );
            })}
        </select>
        <Link to="/game">
          <button>Enjoy</button>
        </Link>
      </main>
    </>
  );
};

export default Difficulty;
