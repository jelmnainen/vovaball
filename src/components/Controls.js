import React, { useState } from 'react'
import './Controls.css'
function Game(props) {
  // DESTRUCTURING
  const {
    dispatch,
    movementLeft,
    hasCollided,
  } = props

  // RENDER
  if (hasCollided) {
    return(
      <div className="Controls">
        Movement left: {movementLeft}
        <button className="control-action" onClick={() => dispatch({type: 'guard'})}>Guard</button>
        <button className="control-action" onClick={() => dispatch({type: 'dribble'})}>Dribble</button>
        <button className="control-action" onClick={() => dispatch({type: 'shoot'})}>Shoot</button>
      </div>
    )
  }
  return (
    <div className="Controls">
      <div className="movement">
        Movement left: {movementLeft}
        <div className="movement-top">
          <button className="control-action" onClick={() => dispatch({type: 'move.UP'})}>Up</button>
        </div>
        <div className="movement-middle">
          <button className="control-action" onClick={() => dispatch({type: 'move.LEFT'})}>Left</button>
          <button className="control-action" onClick={() => dispatch({type: 'move.RIGHT'})}>Right</button>
        </div>
        <div className="movement-bottom">
          <button className="control-action" onClick={() => dispatch({type: 'move.DOWN'})}>Down</button>
        </div>
      </div>
      <div className="cotrols-shoot">
        <button className="control-action" onClick={() => dispatch({type: 'shoot'})}>Shoot</button>
      </div>
    </div>
  );
}

export default Game;
