// import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Welcome, Difficulty, Game } from "./pages/index";
import { GameProvider } from "./logic/globalContext"; //import the game provider
import "./App.css";

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="difficulty" element={<Difficulty />} />
          <Route path="game" element={<Game />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
