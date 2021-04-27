import React, { useState } from 'react'
import './CharacterCreation.css'
import * as R from 'ramda'

const CharacterFormField = (setAttr) => ([key, value]) => {
  return (
    <label htmlFor={`input-${key}`} key={`input-${key}`}>
      <small>
        {key}
      </small>
      <input
        id={`input-${key}`}
        type="number"
        value={value}
        min="0"
        max="100"
        onChange={setAttr(key)}
      />
    </label>
  )
}

const calculateTotalCharacterAttributePoints = (character) =>
  Object.values(character).reduce((a, b) => a + b, 0)

function CharacterCreation(props) {
  // DESTRUCTURING
  const {
    character,
    characterPointsTotal,
    setCharacter,
    goToIntro,
    goToPlay
  } = props

  // STATE
  const setAttr = (attr) => (e) => {
    e.preventDefault()
    const newAttrValue = R.pipe(
      R.pathOr("0", ['target', 'value']),
      (v) => v === '' ? "0" : v,
      (v) => parseInt(v, 10)
    )(e)
    const newCharacter = R.assoc(
      attr,
      newAttrValue,
      character
    )
    setCharacter(newCharacter)
  }
  const goToPlayIfPointsAreOk = (e) => {
    if (characterPointsTotal - calculateTotalCharacterAttributePoints(character) < 0) {
      return
    }
    goToPlay(e)
  }

  // RENDER
  const pointsLeft = characterPointsTotal - calculateTotalCharacterAttributePoints(character)
  const formFields = Object.entries(character).map(CharacterFormField(setAttr))
  return (
    <div className="CharacterCreation">
        <h1>Character creation</h1>
        <div>
          Character points left: {pointsLeft}
        </div>
        <form className="CharacterCreation-form">
          {formFields}
        </form>
        <button onClick={goToIntro}>
          Back to intro
        </button>
        <button onClick={goToPlayIfPointsAreOk}>
          Play!
        </button>
    </div>
  );
}

export default CharacterCreation;
