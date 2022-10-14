import React from "react"
import ReactDOM from "react-dom"
import "./styles.css"
import { proxy, useProxy } from "valtio"
import useWindowSize from "react-use/lib/useWindowSize"
import Confetti from "react-confetti"

class GameState {
  lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]] // prettier-ignore
  squares = Array(9).fill(null)
  get nextValue() {
    return this.squares.filter((r) => r === "O").length === this.squares.filter((r) => r === "X").length ? "X" : "O"
  }
  get status() {
    return this.winner
      ? `Winner: ${this.winner}`
      : this.squares.every(Boolean)
      ? `Scratch`
      : `Next player: ${this.nextValue}`
  }
  get winner() {
    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i]
      if (this.squares[a] && this.squares[a] === this.squares[b] && this.squares[a] === this.squares[c])
        return this.squares[a]
    }
    return null
  }
  selectSquare(square) {
    if (this.winner || this.squares[square]) return
    this.squares[square] = this.nextValue
  }
  reset() {
    this.squares = Array(9).fill(null)
  }
}

const xoxo = proxy(new GameState())

function Square({ i }) {
  const snapshot = useProxy(xoxo)
  return (
    <button className={`square ${snapshot.squares[i]}`} onClick={() => xoxo.selectSquare(i)}>
      {snapshot.squares[i]}
    </button>
  )
}

function Status() {
  const snapshot = useProxy(xoxo)
  return (
    <div className="status">
      <div className="message">{snapshot.status}</div>
      <button onClick={() => xoxo.reset()}>Reset</button>
    </div>
  )
}

function End() {
  const { width, height } = useWindowSize()
  const snapshot = useProxy(xoxo)
  return (
    snapshot.winner && (
      <Confetti width={width} height={height} colors={[snapshot.winner === "X" ? "#d76050" : "#509ed7", "white"]} />
    )
  )
}

ReactDOM.render(
  <>
    <div className="game">
      <h1>
        x<span>o</span>x<span>o</span>
      </h1>
      <Status />
      <div className="board">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((field) => (
          <Square key={field} i={field} />
        ))}
      </div>
    </div>
    <End />
  </>,
  document.getElementById("root"),
)
