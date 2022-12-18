import React, { useEffect, useRef } from "react";
import Phaser from 'phaser';
import { PlayGame } from "../game/scenes/main";
import Button from "./Button";

import './Game.css';

const Game = () => {
    const initUseEffectCalled = useRef(false);

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
        <>
            <Button />
            <div id="game" className="game">
            </div>
        </>
    )
}

export default Game;