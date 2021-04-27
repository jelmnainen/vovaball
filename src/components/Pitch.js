import React from 'react'
import './Pitch.css'

const getSquareClass = (contents, i) => {
  let base = `Pitch-square pitch-row-${i}`
  if (contents === 'E') {
    return `${base} pitch-square-opponent`
  }
  if (contents === 'EG') {
    return `${base} pitch-square-opponent-goalie`
  }
  if (contents === 'V') {
    return `${base} pitch-square-vova`
  }
  return base
}

const PitchSquare = (props) => {
  const { square, i } = props
  const classes = getSquareClass(square, i)
  return (
    <div className={classes} key={`square-${i}`}>
    </div>
  )
}

const PitchColumn = (props) => {
  const { column, i } = props
  const columnSquares = column.map((square, i) => <PitchSquare square={square} i={i} />)
  const classes = `Pitch-column pitch-column-${i}`
  return(
    <div className={classes}>
      { columnSquares }
    </div>
  )
}

function Game(props) {
  // DESTRUCTURING
  const {
    pitch,
  } = props

  // STATE

  // RENDER
  const pitchSquares = pitch.map((column, i) => <PitchColumn column={column} i={i} />)
  return (
    <div className="Pitch">
      {pitchSquares}
    </div>
  );
}

export default Game;
