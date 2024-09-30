import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const GameContext = createContext();

// Create the Provider for context
export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);

  //   upload the name if it exists in localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }
  }, []);

  // save the name in localStorage
  useEffect(() => {
    if (playerName) {
      localStorage.setItem("playerName", playerName);
    }
  }, [playerName]);

  return (
    <GameContext.Provider
      value={{ playerName, setPlayerName, score, setScore }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Create Hook to easely use the context
export const useGameContext = () => {
  return useContext(GameContext);
};
