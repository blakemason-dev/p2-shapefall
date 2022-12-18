import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Game from './components/Game'

function App() {

    return (
        <div className="App">
            <h2>p2-shapefall</h2>
            <Game />
            <p>Controls: W, A, S, D to control pacman</p>
        </div>
    )
}

export default App
