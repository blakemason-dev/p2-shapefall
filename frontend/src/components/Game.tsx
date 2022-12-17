import React, { useEffect, useRef } from "react";
import Phaser from 'phaser';

const Game = () => {
    const initUseEffectCalled = useRef(false);

    useEffect(() => {
        if (initUseEffectCalled.current) return;
        initUseEffectCalled.current = true;

        const config = {
            type: Phaser.AUTO,
            width: 640,
            height: 360,
            parent: 'game'
        }
    
        const game = new Phaser.Game(config);

    }, [])

    

    return (
        <div id="game" />
    )
}

export default Game;