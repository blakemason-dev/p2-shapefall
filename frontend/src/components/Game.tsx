import React, { useEffect, useRef, useState } from "react";
import Phaser from 'phaser';

import { GithubPicker } from 'react-color';

import { PlayGame } from "../game/scenes/main";

import './Game.css';

const Game = () => {
    const initUseEffectCalled = useRef(false);

    const [shape, setShape] = useState('circle');
    const [color, setColor] = useState('#B80000');

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

    }, []);

    const handleColorChange = (color: any, event: any) => {
        setColor(color.hex);
    }

    const handleDeploy = (e: any) => {
        e.preventDefault();

        const event = new CustomEvent('deploy-shape', {
            detail: {
                shape: shape,
                color: color
            }
        });

        window.dispatchEvent(event);
    }

    return (
        <div className="game">
            <form className="game__config" onSubmit={handleDeploy}>

                <div className="game__config-shapepick">
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
                </div>

                <GithubPicker
                    width="240px"
                    triangle="hide"
                    onChange={handleColorChange}
                    colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694']}
                />

                <button className="game__config-deploy" style={{ background: color }}>Deploy {shape}</button>
            </form>
            <div id="game" className="game__viewer">
            </div>
        </div>
    )
}

export default Game;