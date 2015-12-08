import React, { Component } from 'react'

import {
  addIndex,
  append,
  contains,
  curry,
  filter,
  flatten,
  indexOf,
  isEmpty,
  map,
  reduce,
  repeat,
  update
} from 'ramda'

import Square from './square.jsx!'

const mapIndexed = addIndex(map)

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

class Game extends Component {

  constructor (props) {
    super(props)

    this.state = { history: [] }
  }

  handleClick (square) {
    this.setState({ history: append(square, this.state.history) })
  }

  getPlayer (move, history) {
    return (indexOf(move, history) % 2 === 0) ? 'x' : 'o'
  }

  makeMove (history, memo, move) {
    const player = this.getPlayer(move, history)

    return update(move, player, memo)
  }

  getBoard (history) {
    const move = curry(this.makeMove.bind(this))
    const memo = repeat(false, 9)

    return reduce(move(history), memo, history)
  }

  checkForWin (board) {
    return filter(function (pattern) {
      var s1 = board[pattern[0]]
      var s2 = board[pattern[1]]
      var s3 = board[pattern[2]]

      return s1 && s1 === s2 && s2 === s3
    }, winPatterns)
  }

  render () {
    const board  = this.getBoard(this.state.history)
    const wins   = flatten(this.checkForWin(board))
    const inPlay = isEmpty(wins)
    const status = inPlay ? 'board' : 'board won'

    return <div className={status}>
      {this.renderBoard(board, wins)}
    </div>
  }

  renderBoard (board, wins) {
    const inPlay = isEmpty(wins)

    return mapIndexed((player, idx) => {
      if (inPlay) {
        if (player) {
          return <Square key={idx} player={player}/>
        } else {
          return <Square key={idx} clickCb={this.handleClick.bind(this, idx)}/>
        }
      } else {
        return <Square key={idx} player={player} win={contains(idx, wins)}/>
      }
    }, board)
  }
}

export default Game
