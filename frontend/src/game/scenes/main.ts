import Phaser from 'phaser';
import p2 from 'p2';
import * as ConvertP2 from '../utils/ConvertP2';

const FIXED_TIME_STEP = 1 / 25;
const MAX_SUB_STEPS = 10;

const P2_GAME_HEIGHT = 10;
const P2_GAME_WIDTH = P2_GAME_HEIGHT * 16 / 9;

let theta = 0;

export class PlayGame extends Phaser.Scene {
    // keys
    private WKey?: Phaser.Input.Keyboard.Key;
    private AKey?: Phaser.Input.Keyboard.Key;
    private SKey?: Phaser.Input.Keyboard.Key;
    private DKey?: Phaser.Input.Keyboard.Key;
    
    // physics
    private world?: p2.World;
    // private body?: p2.Body;
    // private shape?: p2.Shape;
    private p2Bodies: any[] = [];
    private p2Shapes: any[] = [];
    private phaserShapes: any[] = [];

    private playerBody?: p2.Body;
    private playerShape?: p2.Shape;
    private playerSprite?: Phaser.GameObjects.Sprite;

    private itemBody?: p2.Body;
    private itemShape?: p2.Shape;

    private debugText?: Phaser.GameObjects.Text;

    constructor() {
        super("PlayGame");
    }

    init() {
        console.log('PlayGame: init()');
    }

    preload() {
        console.log('PlayGame: preload()');

        this.load.image('pacman', '/src/game/assets/pacman.png');
    }

    createFallingObject() {
        const shape = new p2.Circle({
            radius: 0.5
        });

        const body = new p2.Body({
            mass: 5,
            position: [P2_GAME_WIDTH/2, P2_GAME_HEIGHT*1.1],

        });

        body.addShape(shape);
        this.world?.addBody(body);

        this.p2Shapes.push(shape);
        this.p2Bodies.push(body);

        const circleShape = this.add.circle(
            ConvertP2.xToPhaser(body.position[0], P2_GAME_WIDTH, this.scale), 
            ConvertP2.yToPhaser(body.position[1], P2_GAME_HEIGHT*1.1, this.scale), 
            ConvertP2.dimToPhaser(0.5, P2_GAME_WIDTH, this.scale)
        );
        circleShape.setStrokeStyle(3, 0xefc53f);
        this.phaserShapes.push(circleShape);
    }

    create() {
        console.log('PlayGame: create()');

        // create the world
        this.world = new p2.World({
            gravity: [0, -9.81]
        });

        this.createFallingObject();

        // create a floor
        var floorBody = new p2.Body({
            mass: 0 // Setting mass to 0 makes it static
        });
        var floorShape = new p2.Plane();
        floorBody.addShape(floorShape);
        this.world.addBody(floorBody);

        // create a kinematic player
        this.playerBody = new p2.Body({
            mass: 2,
            position: [5, 5]
        });
        this.playerBody.type = p2.Body.KINEMATIC;
        // this.playerBody.collisionResponse = false;
        this.playerShape = new p2.Circle({
            radius: 0.5
        });
        this.playerBody.addShape(this.playerShape);

        this.playerSprite = this.add.sprite(
            ConvertP2.xToPhaser(this.playerBody.position[0], P2_GAME_WIDTH, this.scale),
            ConvertP2.yToPhaser(this.playerBody.position[1], P2_GAME_HEIGHT, this.scale),
            "pacman"
        );
        this.playerSprite.displayWidth = ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale);
        this.playerSprite.displayHeight = ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale);

        this.world.addBody(this.playerBody);

        // create input keys
        this.WKey = this.input.keyboard.addKey('W');
        this.AKey = this.input.keyboard.addKey('A');
        this.SKey = this.input.keyboard.addKey('S');
        this.DKey = this.input.keyboard.addKey('D');

        this.debugText = this.add.text(10, 10, "dt: ");

        this.world.on('beginContact', () => {
            console.log('contact');
        });

        // add event listener
        // const deployShapeFinsihedEventListener = () => {
        //     window.removeEventListener("deploy-shape", deployShapeFinsihedEventListener);
        // };
        window.addEventListener("deploy-shape", () => {
            console.log('called deploy-shape');
            this.createFallingObject();
        });
    }

    update(t: number, dt: number) {
        if (!this.playerBody || !this.playerSprite) return;

        let v_x = 0;
        let v_y = 0;
        // get input
        if (this.WKey?.isDown) {
            v_y = 5;
        }
        if (this.AKey?.isDown) {
            v_x = -5;
        }
        if (this.SKey?.isDown) {
            v_y = -5;
        }
        if (this.DKey?.isDown) {
            v_x = 5;
        }

        const vel_norm = p2.vec2.normalize([0,0], [v_x, v_y]);
        const SPEED = 5;
        this.playerBody.velocity[0] = vel_norm[0] * SPEED;
        this.playerBody.velocity[1] = vel_norm[1] * SPEED;
        
        if (p2.vec2.length(vel_norm) > 0.01) {
            theta = Math.atan2(vel_norm[1], vel_norm[0]);
            this.playerBody.angle = theta;
        }

        // handle game logic
        if (this.debugText) this.debugText.text = 
            "dt: " + dt.toFixed(3) + 
            "ms\nFPS: " + (1000/dt).toFixed(2) + 
            "\nPacman Angle: " + theta.toFixed(2);
        ;

        // step the physics world
        this.world?.step(FIXED_TIME_STEP, dt/1000, MAX_SUB_STEPS);
        for (let i = 0; i < this.p2Bodies.length; i++) {
            const p2Body = this.p2Bodies[i];
            const p2Shape = this.p2Shapes[i];
            const phaserShape = this.phaserShapes[i];

            const x = p2Body?.interpolatedPosition[0];
            const y = p2Body?.interpolatedPosition[1];
            if (x && y) {
                phaserShape.x = ConvertP2.xToPhaser(x, P2_GAME_WIDTH, this.scale);
                phaserShape.y = ConvertP2.yToPhaser(y, P2_GAME_HEIGHT, this.scale);
            }
        }
        // this.shapes.map(shp => {
        //     const x = this.body?.interpolatedPosition[0];
        //     const y = this.body?.interpolatedPosition[1];
        //     if (x && y) {
        //         shp.x = ConvertP2.xToPhaser(x, P2_GAME_WIDTH, this.scale);
        //         shp.y = ConvertP2.yToPhaser(y, P2_GAME_HEIGHT, this.scale);
        //     }
        // });

        // update player sprite
        this.playerSprite.x = ConvertP2.xToPhaser(this.playerBody.interpolatedPosition[0], P2_GAME_WIDTH, this.scale);
        this.playerSprite.y = ConvertP2.yToPhaser(this.playerBody.interpolatedPosition[1], P2_GAME_HEIGHT, this.scale);
        this.playerSprite.angle = ConvertP2.radToPhaserAngle(theta);
    }
}