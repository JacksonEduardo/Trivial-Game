import "../style/game.css";
import { useGameContext } from "../logic/globalContext"; // import the context to use the name

const Game = () => {
  const { playerName } = useGameContext();

  return (
    <main>
      <section>
        <h1>{playerName}</h1>
        <h1>Domande</h1>
      </section>
      <section>
        <h3>Do you want to save your score?</h3>
        <button>Save and Publish</button>
      </section>
    </main>
  );
};

export default Game;
