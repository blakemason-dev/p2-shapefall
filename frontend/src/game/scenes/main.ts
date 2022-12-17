import Phaser from 'phaser';

class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    init() {
        console.log('PlayGame: init()');
    }

    preload() {
        console.log('PlayGame: preload()');
    }

    create() {
        console.log('PlayGame: create()');

        const circleShape = this.add.circle(300, 400, 40, 0xffffff);
    }

    update(t: number, dt: number) {
        if (this.input.keyboard.checkDown())
    }
}