import Phaser from 'phaser';
import p2 from 'p2';
import * as ConvertP2 from '../utils/ConvertP2';

const FIXED_TIME_STEP = 1 / 25;
const MAX_SUB_STEPS = 10;

const P2_GAME_HEIGHT = 10;
const P2_GAME_WIDTH = P2_GAME_HEIGHT * 16 / 9;

export class PlayGame extends Phaser.Scene {
    // shapes
    private shapes: any[] = [];

    // keys
    private WKey?: Phaser.Input.Keyboard.Key;
    private AKey?: Phaser.Input.Keyboard.Key;
    private SKey?: Phaser.Input.Keyboard.Key;
    private DKey?: Phaser.Input.Keyboard.Key;

    // physics
    private world?: p2.World;
    private body?: p2.Body;
    private shape?: p2.Shape;

    private text?: Phaser.GameObjects.Text;

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

        // create the world
        this.world = new p2.World({
            gravity: [0, -9.81]
        });

        this.shape = new p2.Circle({
            radius: 0.5
        });

        this.body = new p2.Body({
            mass: 5,
            position: [P2_GAME_WIDTH/2, P2_GAME_HEIGHT/2],

        });

        this.body.addShape(this.shape);
        this.world.addBody(this.body);

        // create a circle shape
        const circleX = ConvertP2.xToPhaser(this.body.position[0], P2_GAME_WIDTH, this.scale);
        const circleY = ConvertP2.yToPhaser(this.body.position[1], P2_GAME_HEIGHT, this.scale);
        const circleRadius = ConvertP2.dimToPhaser(0.5, P2_GAME_WIDTH, this.scale);
        const circleShape = this.add.circle(circleX, circleY, circleRadius);
        circleShape.setStrokeStyle(3, 0xefc53f);
        this.shapes.push(circleShape);

        // create a floor
        var floorBody = new p2.Body({
            mass: 0 // Setting mass to 0 makes it static
        });
        var floorShape = new p2.Plane();
        floorBody.addShape(floorShape);
        this.world.addBody(floorBody);

        // create input keys
        this.WKey = this.input.keyboard.addKey('W');
        this.AKey = this.input.keyboard.addKey('A');
        this.SKey = this.input.keyboard.addKey('S');
        this.DKey = this.input.keyboard.addKey('D');

        this.text = this.add.text(10, 10, "dt: ");
    }

    update(t: number, dt: number) {
        // get input
        if (this.WKey?.isDown) {
            this.shapes.map(shp => {
                shp.y -= 5;
            });
        }
        if (this.AKey?.isDown) {
            this.shapes.map(shp => {
                shp.x -= 5;
            });
        }
        if (this.SKey?.isDown) {
            this.shapes.map(shp => {
                shp.y += 5;
            });
        }
        if (this.DKey?.isDown) {
            this.shapes.map(shp => {
                shp.x += 5;
            });
        }

        // handle game logic
        if (this.text) this.text.text = "dt: " + dt.toFixed(3) + "ms";

        // step the physics world
        this.world?.step(FIXED_TIME_STEP, dt/1000, MAX_SUB_STEPS);
        this.shapes.map(shp => {
            const x = this.body?.interpolatedPosition[0];
            const y = this.body?.interpolatedPosition[1];
            if (x && y) {
                shp.x = ConvertP2.xToPhaser(x, P2_GAME_WIDTH, this.scale);
                shp.y = ConvertP2.yToPhaser(y, P2_GAME_HEIGHT, this.scale);
            }
        })
    }
}