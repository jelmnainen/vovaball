import React, { useState } from 'react'
import './Introduction.css'

function Introduction(props) {
  const { goToCharacterCreation } = props
  return (
    <div className="introduction">
        <h1>Vovaball</h1>
        <div class="story-line">
          Welcome, footballer! Today was supposed to be the day for the big match.
        </div>
        <div class="story-line">
          However, things got... out of control.
        </div>
        <div class="story-line">
          The teams had a dispute over who were the more hardened drinkers.
        </div>
        <div class="story-line">
          And decided to solve the issue by drinking each other under the table.
        </div>
        <div class="story-line">
          The result: your team lost. They're sleeping in a big pile next to the pitch.
        </div>
        <div class="story-line">
          Now you - the one who were late to the warmup, and hence did not participate in the drink-off, need to single-handedly uphold your teams honor!
        </div>
        <div class="story-line">
          The good part? The opposing team is so drunk, it just might be possible to single-handedly defeat them...
        </div>
        <button onClick={goToCharacterCreation}>
          Create your character!
        </button>
    </div>
  );
}

export default Introduction;
