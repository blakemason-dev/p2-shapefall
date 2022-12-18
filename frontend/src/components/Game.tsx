import React, { useEffect, useRef, useState } from "react";
import Phaser from 'phaser';
import { PlayGame } from "../game/scenes/main";
import Button from "./Button";

import './Game.css';
import Radio from "./Radio";

const Game = () => {
    const initUseEffectCalled = useRef(false);

    const [shape, setShape] = useState('circle');

    useEffect(() => {
        if (initUseEffectCalled.current) return;
        initUseEffectCalled.current = true;

        const config = {
            type: Phaser.AUTO,
            width: 640,
            height: 360,
            parent: 'game',
            scene: PlayGame
        }

        const game = new Phaser.Game(config);
        console.log('Create new Phaser Game');

    }, [])

    return (
        <div className="game">
            <form className="game__config">
                <input
                    type="radio"
                    id="circle"
                    checked={shape === 'circle'}
                    onClick={() => setShape("circle")}
                />
                <label>Circle</label>
                <br />

                <input
                    type="radio"
                    id="square"
                    checked={shape === 'square'}
                    onClick={() => setShape("square")}
                />
                <label>Square</label>
                <br />

                <input
                    type="radio"
                    id="triangle"
                    checked={shape === 'triangle'}
                    onClick={() => setShape("triangle")}
                />
                <label>Triangle</label>
                <br />
            </form>
            <div id="game" className="game__viewer">
            </div>
        </div>
    )
}

export default Game;