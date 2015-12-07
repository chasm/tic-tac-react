import React from 'react'
import TestUtils from 'react-addons-test-utils'

import { expect } from 'chai'

import App from '../app/components/app.jsx!'
import Game from '../app/components/game.jsx!'
import Square from '../app/components/square.jsx!'

import { forEach } from 'ramda'

const {
  isCompositeComponent,
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate
} = TestUtils


describe("App", () => {

  it("is a composite component", () => {
    const app = renderIntoDocument(<App/>)

    expect(isCompositeComponent(app)).to.be.ok
  })
})

describe("Game", () => {
  let game

  beforeEach(() => {
    game = renderIntoDocument(<Game/>)
  })

  it("is a composite component", () => {
    expect(isCompositeComponent(game)).to.be.ok
  })

  it("has a board", () => {
    expect(scryRenderedDOMComponentsWithClass(game, 'board')).not.to.be.empty
  })

  it("begins with an empty history", () => {
    expect(game.state.history).to.eql([])
  })

  it("tracks moves in game history", () => {
    const board = scryRenderedDOMComponentsWithClass(game, 'board')

    const center = board[0].childNodes[4]
    const midLeft = board[0].childNodes[3]
    const topLeft = board[0].childNodes[0]

    Simulate.click(center)
    Simulate.click(midLeft)
    Simulate.click(topLeft)

    expect(game.state.history).to.eql([4,3,0])
  })

  it("can alternate moves, X first", () => {
    let board = scryRenderedDOMComponentsWithClass(game, 'board')

    let center = board[0].childNodes[4]
    let midLeft = board[0].childNodes[3]
    let topLeft = board[0].childNodes[0]

    Simulate.click(center)
    Simulate.click(midLeft)
    Simulate.click(topLeft)

    expect(center.innerHTML).to.equal('x')
    expect(midLeft.innerHTML).to.equal('o')
    expect(topLeft.innerHTML).to.equal('x')
  })

  it("recognizes a win", () => {
    const board = scryRenderedDOMComponentsWithClass(game, 'board')
    const moves = [4, 3, 0, 8, 2, 1, 6] // win

    forEach((idx) => Simulate.click(board[0].childNodes[idx]), moves)

    expect(scryRenderedDOMComponentsWithClass(game, 'board won')).not.to.be.empty
  })

  it("prevents further play after a win", () => {
    const board = scryRenderedDOMComponentsWithClass(game, 'board')
    const lastSquare = board[0].childNodes[7]
    const moves = [4, 3, 0, 8, 2, 1, 6] // win

    forEach((idx) => Simulate.click(board[0].childNodes[idx]), moves)

    Simulate.click(lastSquare)

    expect(lastSquare.innerHTML).to.be.empty
  })

  describe("board", () => {
    it("has nine squares", () => {
      const board = scryRenderedDOMComponentsWithClass(game, 'board')

      expect(board[0].childNodes.length).to.equal(9)
    })

    it("prevents rewriting squares", () => {
      let board = scryRenderedDOMComponentsWithClass(game, 'board')

      let center = board[0].childNodes[4]

      Simulate.click(center)
      Simulate.click(center)

      expect(center.innerHTML).to.equal('x')
    })
  })
})

describe("Square", () => {
  let square
  const player = 'x'

  describe("when empty", () => {
    before(() => {
      square = renderIntoDocument(<Square/>)
    })

    it("is a composite component", () => {
      expect(isCompositeComponent(square)).to.be.ok
    })

    it("calls a callback when clicked", () => {
      const cb = (event) => console.log("Clickeroonie!")
      square = renderIntoDocument(<Square clickCb={cb}/>)

      Simulate.click(square)
    })
  })

  describe("after play", () => {
    beforeEach(() => {
      square = renderIntoDocument(<Square player={player}/>)
    })

    it("has the correct content", () => {
      const div = scryRenderedDOMComponentsWithTag(square, 'div')[0]

      expect(div && div.innerHTML).to.equal(player)
    })

    it("applies the player's style", () => {
      expect(scryRenderedDOMComponentsWithClass(square, 'x')).not.to.be.empty
    })
  })
})
