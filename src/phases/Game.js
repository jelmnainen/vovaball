import React, { useReducer } from 'react'
import './Game.css'
import Pitch from '../components/Pitch'
import Controls from '../components/Controls'
import * as R from 'ramda'

const getYDiff = (x) => {
  if (x < 11) {
    return 11 - x
  }
  if (x > 15) {
    return x - 15
  }
  return 0
}

const calculateShotDistance = (x, y) => {
  const ydiff = getYDiff(y)
  const distance = Math.sqrt(Math.pow(ydiff, 2) + Math.pow(x, 2))
  return distance
}

const calculateShotDifficulty = (x, y, skill) => {
  const distance = calculateShotDistance(x, y)
  const raw = distance / 25
  const playerDiff = raw * (151 - skill) / 100
  return Math.max(0.05, Math.min(playerDiff, 0.95))
}

const getPitch = (opponents, team) => {
  const pitch = Array.apply(null, Array(49)).map(() => Array.apply(null, Array(29)).map(() => ''))
  for (let i=0; i<opponents.length;  i++) {
    let opponent = opponents[i]
    pitch[opponent.x][opponent.y] = 'E'
  }
  pitch[team.x][team.y] = 'V'
  return pitch
}

const initialOpponents = [
  { isGoalie: true, x: 0, y: 13 },
  { isGoalie: false, x: 5, y: 2 },
  { isGoalie: false, x: 5, y: 13 },
  { isGoalie: false, x: 5, y: 23 },

  { isGoalie: false, x: 12, y: 3 },
  { isGoalie: false, x: 12, y: 8 },
  { isGoalie: false, x: 12, y: 18 },
  { isGoalie: false, x: 12, y: 23 },

  { isGoalie: false, x: 25, y: 3 },
  { isGoalie: false, x: 20, y: 13 },
  { isGoalie: false, x: 25, y: 23 },
]

const initialPlayer = (character) => ({
  x: 25,
  y: 13,
  movementLeft: calculateMovementPoints(character.speed)
})

const initialState = (character) => ({
  opponents: initialOpponents,
  player: initialPlayer(character),
  pitch: getPitch(initialOpponents, initialPlayer(character)),
  character,
  victory: false,
  loss: false,
  reason: '',
  hasCollided: false,
})

const squeeze = ([lower, upper], value) => Math.max(lower, Math.min(value, upper))

const recalculateOpponent = (opponent) => {
  const xmod = Math.round(Math.random()*4) - 2
  const ymod = Math.round(Math.random()*4) - 2
  if (opponent.isGoalie) {
    const newx = 0
    const newy = squeeze([11, 15], opponent.y + ymod)
    return ({ ...opponent, x: newx, y: newy })
  }
  const newx = squeeze([0, 49], opponent.x + xmod)
  const newy = squeeze([0, 24], opponent.y + ymod)

  return ({ ...opponent, x: newx, y: newy })
}

const detectCollision = (player, opponents) => {
  const {x, y} = player
  const collisionSquares = [
    [x-1, y+1], [x, y+1], [x+1, y+1],
    [x-1, y],   [x, y],   [x+1, y],
    [x-1, y-1], [x, y-1], [x+1, y-1],
  ]

  for (let i=0; i<collisionSquares.length; i++) {
    for (let j=0; j<opponents.length; j++) {
      if (collisionSquares[i][0] === opponents[j].x && collisionSquares[i][1] === opponents[j].y) {
        return true
      }
    }
  }

  return false
}

const attemptToDribble = (agility) => {
  const raw = agility / 75
  const adjusted = Math.max(0.05, Math.min(raw, 0.95))
  return (Math.random() < adjusted)
}

const getNewXandY = (oldX, oldY, move) => {
  switch(move) {
    case 'UP':
      if (oldY > 0) {
        return([oldX, oldY - 1])
      }
      return [oldX, oldY]
    case 'DOWN':
      if (oldY < 29) {
        return([oldX, oldY + 1])
      }
      return [oldX, oldY]
    case 'LEFT':
      if (oldX > 0) {
        return([ oldX - 1, oldY])
      }
      return [oldX, oldY]
    case 'RIGHT':
      if (oldX < 48) {
        return([oldX + 1, oldY])
      }
      return [oldX, oldY]
    default:
      return [oldX, oldY]
  }

}


const reducer = (state, {type, payload}) => {
  const [main, secondary] = type.split(".")
  switch (main) {
    case 'move':
      const [newX, newY] = getNewXandY(state.player.x, state.player.y, secondary)
      const newPlayer = {
        ...state.player,
        y: newY,
        x: newX,
        movementLeft: state.player.movementLeft - 1
      }
      if (newPlayer.movementLeft > 0) {
        const newPitch = getPitch(state.opponents, newPlayer)
        const hasCollided = detectCollision(newPlayer, state.opponents)
        return({ ...state, player: newPlayer, pitch: newPitch, hasCollided })
      }
      const movementResettedPlayer = { ...newPlayer, movementLeft: calculateMovementPoints(state.character.speed)}
      const newOpponents = state.opponents.map(recalculateOpponent)
      const hasCollided = detectCollision(newPlayer, newOpponents)
      const newPitch = getPitch(newOpponents, newPlayer)
      return({ ...state, opponents: newOpponents, player: movementResettedPlayer, pitch: newPitch, hasCollided })
    case 'shoot':
      const shotDifficulty = calculateShotDifficulty(state.player.x, state.player.y, state.character.shooting)
      const shot = Math.random()
      console.log(shotDifficulty, shot)
      if (shot > shotDifficulty) {
        return({ ...state, victory: true })
      } else {
        return({ ...state, loss: true, reason: 'shootfail' })
      }
    case 'guard':
      const guardingPlayer = {
        ...state.player,
        x: squeeze([0, 49], state.player.x + 3)
      }
      const guardingPitch = getPitch(state.opponents, guardingPlayer)
      const guardingCollided = detectCollision(guardingPlayer, state.opponents)
      return { ...state, player: guardingPlayer, pitch: guardingPitch, hasCollided: guardingCollided}
    case 'dribble':
      const dribbleSuccessful = attemptToDribble(state.player.agility)
      if (dribbleSuccessful) {
        const dribblingPlayer = { ...state.player, x: squeeze([0, 49], state.player.x - 3) }
        const hasCollided_ = detectCollision(dribblingPlayer, state.opponents)
        const newPitch_ = getPitch(state.opponents, dribblingPlayer)
        return ({ ...state, player: dribblingPlayer, hasCollided: hasCollided_, pitch: newPitch_ })
      }
      return ({ ...state, loss: true, reason: 'dribblefail' })
    default:
      return state
    }

  }

const calculateMovementPoints = (speed) => {
  return Math.round(speed / 33) + 1
}

function Game(props) {
  // DESTRUCTURING
  const {
    character,
    goToCharacterCreation
  } = props

  // STATE
  const [
    {
      opponents,
      player,
      pitch,
      victory,
      loss,
      hasCollided,
      reason
    },
    dispatch
  ] = useReducer(reducer, initialState(character))
  // RENDER
  if (victory) {
    return(
      <div className="Victory">
        <h1>VICTORY!</h1>
        <div className="story-line">
          You shoot the ball towards the net. While the drunken goalie valiantly tries to catch it, he is no match for your shooting skills which you have honed to perfection over the years.
        </div>
        <div className="story-line">
          You have done it. You single-handedly managed to score against a whole team. Granted, they were piss-drunk, but that is not how you'll recount the tale...
        </div>
        <div className="story-line">
          Sensing your superiority, the opposing team quickly routs and starts packing.
        </div>
        <div className="story-line">
          Meanwhile, your team rises from their drunken stupor and carries you to the local bar to fix your state of un-drunkedness. Huzzah!
        </div>
      </div>
    )
  }
  if (loss) {
    if (reason === 'dribblefail') {
      return (
        <div className="Loss">
          <h1>LOSS!</h1>
          <div className="story-line">
            Surely the drunken opponent is easy to dribble?
          </div>
          <div className="story-line">
            With suprising agility, the opposing team's player takes the ball from you and grins.
          </div>
          <div className="story-line">
            Your goal is empty, no thanks to your goalie, an old drunk.
          </div>
          <div className="story-line">
            It is almost too easy for the opposing team to score when they had eleven players on the pitch and you one.
          </div>
          <div className="story-line">
            Swallowing your pride, you take your team to the local bar - you have some catching up to do!
          </div>
        </div>
      )
    } else {
      return (
        <div className="Loss">
          <h1>LOSS!</h1>
          <div className="story-line">
            You take a quick look at the enemy goal.
          </div>
          <div className="story-line">
            It's already in a comfortable distance, and you decide to go for it.
          </div>
          <div className="story-line">
            You've shot this shot a million times, and the opposing team's goalie seems to be giggling at something only he finds funny.
          </div>
          <div className="story-line">
            But as often happens in life, your mind gets into overthinking mode and you watch helplessly as the ball sails over the goalpost.
          </div>
          <div className="story-line">
            Swallowing your pride, you take your team to the local bar - you have some catching up to do!
          </div>
        </div>
      )
    }
  }
  return (
    <div className="Game">
        <h1>Play!</h1>
        <div>
          You are in the possession of the ball.
          Try to dribble the drunken opponents like the forward attacker you are!
          When you get close enough, try to shoot!
        </div>
        <div className="play-area">
          <Pitch
            pitch={pitch}
          />
          <Controls
            dispatch={dispatch}
            movementLeft={player.movementLeft}
            hasCollided={hasCollided}
          />
        </div>
        <button onClick={goToCharacterCreation}>
          Go back to character creation
        </button>
    </div>
  );
}

export default Game;
