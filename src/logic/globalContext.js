import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const GameContext = createContext();

// Create the Provider for context
export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState(""); // to use number in al application
  const [score, setScore] = useState(0); // to use score in All aplication (not in use)
  const [difficulty, setDifficulty] = useState(""); // difficulty easy medium hard
  const [category, setCategory] = useState(""); // to use category in all application
  const [randomMode, setRandomMode] = useState(false); //

  // SAVE in the localStorage
  useEffect(() => {
    // Name
    if (playerName) {
      localStorage.setItem("playerName", playerName);
    }
    // Difficulty
    if (difficulty) {
      localStorage.setItem("difficulty", difficulty);
    }
    if (category) {
      localStorage.setItem("category", JSON.stringify(category)); // convert to string
    }
  }, [playerName, difficulty, category]);

  // UPLOAD if  exists in localStorage
  useEffect(() => {
    // Name
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }

    // Difficulty
    const storedDifficulty = localStorage.getItem("difficulty");
    if (storedDifficulty) {
      setDifficulty(storedDifficulty);
    }

    // Category
    const storedCategory = localStorage.getItem("category");
    if (storedCategory) {
      setCategory(JSON.parse(storedCategory)); // convert to object when upload
    }
  }, []);
  console.log(category);

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        score,
        setScore,
        difficulty,
        setDifficulty,
        category,
        setCategory,
        randomMode,
        setRandomMode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Create Hook to easely use the context
export const useGameContext = () => {
  return useContext(GameContext);
};
