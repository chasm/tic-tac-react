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

    expect(isCompositeComponent(app)).to.equal(true)
  })
})

describe("Game", () => {
  let game

  beforeEach(() => {
    game = renderIntoDocument(<Game/>)
  })

  it("is a composite component", () => {
    expect(isCompositeComponent(game)).to.equal(true)
  })

  it("has one board", () => {
    expect(scryRenderedDOMComponentsWithClass(game, 'board').length).to.equal(1)
  })

  it("begins with an empty history", () => {
    expect(game.state.history).to.eql([])
  })

  describe("board", () => {
    let board

    beforeEach(() => {
      board = scryRenderedDOMComponentsWithClass(game, 'board')[0]
    })

    it("has nine squares", () => {
      expect(board.childNodes.length).to.equal(9)
    })

    it("prevents rewriting squares", () => {
      let center = board.childNodes[4]

      Simulate.click(center)
      Simulate.click(center)

      expect(center.innerHTML).to.equal('x')
    })

    it("tracks moves in game history", () => {
      const center = board.childNodes[4]
      const midLeft = board.childNodes[3]
      const topLeft = board.childNodes[0]

      Simulate.click(center)
      Simulate.click(midLeft)
      Simulate.click(topLeft)

      expect(game.state.history).to.eql([4,3,0])
    })

    it("can alternate moves, X first", () => {
      let center = board.childNodes[4]
      let midLeft = board.childNodes[3]
      let topLeft = board.childNodes[0]

      Simulate.click(center)
      Simulate.click(midLeft)
      Simulate.click(topLeft)

      expect(center.innerHTML).to.equal('x')
      expect(midLeft.innerHTML).to.equal('o')
      expect(topLeft.innerHTML).to.equal('x')
    })

    it("recognizes a win", () => {
      const moves = [4, 3, 0, 8, 2, 1, 6] // win

      forEach((idx) => Simulate.click(board.childNodes[idx]), moves)

      expect(scryRenderedDOMComponentsWithClass(game, 'board won').length).to.equal(1)
    })

    it("prevents further play after a win", () => {
      const lastSquare = board.childNodes[7]
      const moves = [4, 3, 0, 8, 2, 1, 6] // win

      forEach((idx) => Simulate.click(board.childNodes[idx]), moves)

      Simulate.click(lastSquare)

      expect(lastSquare.innerHTML).to.be.empty
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
      expect(isCompositeComponent(square)).to.equal(true)
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
