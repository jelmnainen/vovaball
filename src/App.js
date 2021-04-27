import { useState } from 'react'
import './App.css';
import Introduction from './phases/Introduction'
import CharacterCreation from './phases/CharacterCreation'
import Game from './phases/Game'

function App() {
  // STATE
  const PHASES = {
    INTRODUCTION: "INTRODCTION",
    CHARACTER_CREATION: "CHARACTER_CREATION",
    GAME: "GAME",
  }
  const defaultCharacter = {
    speed: 0,
    shooting: 0,
    dribbling: 0
  }
  const [phase, setPhase] = useState(PHASES.INTRODUCTION)
  const selectPhase = (phase) => (e) => {
    e.preventDefault()
    setPhase(phase)
  }
  const [character, setCharacter] = useState(defaultCharacter)
  const [characterPointsTotal, setCharacterPointsTotal] = useState(3*75)

  // RENDER
  const mainScreen
    = phase === PHASES.INTRODUCTION
    ? <Introduction
        goToCharacterCreation={selectPhase(PHASES.CHARACTER_CREATION)}
      />
    : phase === PHASES.CHARACTER_CREATION
    ? <CharacterCreation
        character={character}
        characterPointsTotal={characterPointsTotal}
        setCharacter={setCharacter}
        setCharacterPointsLeft={setCharacterPointsTotal}
        goToIntro={selectPhase(PHASES.INTRODUCTION)}
        goToPlay={selectPhase(PHASES.GAME)}
      />
    : <Game
        character={character}
        goToCharacterCreation={selectPhase(PHASES.CHARACTER_CREATION)}
      />

  return (
    <div className="App">
      <header className="App-header">
      </header>
      {mainScreen}
    </div>
  );
}

export default App;
