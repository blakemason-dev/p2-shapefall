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

    private p2Bodies: any[] = [];
    private p2Shapes: any[] = [];
    private phaserShapes: any[] = [];

    private playerBody?: p2.Body;
    private playerShape?: p2.Shape;
    private playerSprite?: Phaser.GameObjects.Sprite;

    private itemBody?: p2.Body;
    private itemShape?: p2.Shape;

    private debugText?: Phaser.GameObjects.Text;

    private popSound?: Phaser.Sound.HTML5AudioSound;

    constructor() {
        super("PlayGame");
    }

    init() {
        console.log('PlayGame: init()');
    }

    preload() {
        console.log('PlayGame: preload()');

        this.load.image('pacman', '/src/game/assets/pacman.png');
        this.load.audio('pop', '/src/game/assets/audio/pop.wav', {
            instances: 5
        });
    }

    createFallingObject(shape: string, color: string) {
        let p2Shape;

        const p2Body = new p2.Body({
            mass: 5,
            position: [P2_GAME_WIDTH/2, P2_GAME_HEIGHT*1.1],
        });
        p2Body.allowSleep = true;
        p2Body.sleepSpeedLimit = 1; // Body will feel sleepy if speed<1 (speed is the norm of velocity)
        p2Body.sleepTimeLimit =  1; // Body falls asleep after 1s of sleepiness
        p2Body.damping = 0.5;
        p2Body.angularDamping = 0.5;

        let phaserShape;

        switch (shape) {
            case "circle": {
                phaserShape = this.add.circle(
                    ConvertP2.xToPhaser(p2Body.position[0], P2_GAME_WIDTH, this.scale), 
                    ConvertP2.yToPhaser(p2Body.position[1], P2_GAME_HEIGHT*1.1, this.scale), 
                    ConvertP2.dimToPhaser(0.5, P2_GAME_WIDTH, this.scale)
                );

                p2Shape = new p2.Circle({
                    radius: 0.5
                });
                break;
            }
            case "square": {
                phaserShape = this.add.rectangle(
                    ConvertP2.xToPhaser(p2Body.position[0], P2_GAME_WIDTH, this.scale), 
                    ConvertP2.yToPhaser(p2Body.position[1], P2_GAME_HEIGHT*1.1, this.scale), 
                    ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale),
                    ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale)
                )

                p2Shape = new p2.Box({
                    width: 1,
                    height: 1
                });
                break;
            }
            case "triangle": {
                phaserShape = this.add.polygon(
                    ConvertP2.xToPhaser(p2Body.position[0], P2_GAME_WIDTH, this.scale), 
                    ConvertP2.yToPhaser(p2Body.position[1], P2_GAME_HEIGHT*1.1, this.scale), 
                    [
                        ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale), ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale),
                        ConvertP2.dimToPhaser(0.5, P2_GAME_WIDTH, this.scale), ConvertP2.dimToPhaser(0, P2_GAME_WIDTH, this.scale),
                        ConvertP2.dimToPhaser(0, P2_GAME_WIDTH, this.scale), ConvertP2.dimToPhaser(1, P2_GAME_WIDTH, this.scale),
                    ]
                )
                
                p2Shape = new p2.Convex({
                    vertices: [
                        [0.5, -0.5], 
                        [0, 0.5],
                        [-0.5, -0.5], 
                    ]
                })
                break;
            }
            default: 
                break;
        }

        if (phaserShape && p2Shape) {
            phaserShape.setStrokeStyle(3, parseInt(color.slice(1,7), 16));
            this.phaserShapes.push(phaserShape);

            p2Body.addShape(p2Shape);
            this.world?.addBody(p2Body);
    
            this.p2Shapes.push(p2Shape);
            this.p2Bodies.push(p2Body);
        }


    }

    create() {
        console.log('PlayGame: create()');

        // create the world
        this.world = new p2.World({
            gravity: [0, -9.81]
        });
        this.world.applyDamping = true;
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        this.world.defaultContactMaterial.friction = 0.3;
        this.world.defaultContactMaterial.restitution = 0.3;
        this.world.defaultContactMaterial.stiffness = 1e7;

        this.createFallingObject("circle", "#B80000");

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
            position: [5, 5],
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

        // add sounds
        this.popSound = this.sound.add('pop') as Phaser.Sound.HTML5AudioSound;

        this.world.on('beginContact', (data: any) => {
            console.log('contact');
            if (data.bodyA === this.playerBody || data.bodyB === this.playerBody) {
                this.popSound?.play();
            }
        });

        // add event listener
        window.addEventListener("deploy-shape", (data: any) => {
            this.createFallingObject(data.detail.shape, data.detail.color);
        });
    }

    update(t: number, dt: number) {
        if (!this.playerBody || !this.playerSprite) return;

        let v_x = 0;
        let v_y = 0;

        // 1) get input
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

        // 2) handle game logic
        if (this.debugText) this.debugText.text = 
            "dt: " + dt.toFixed(3) + 
            "ms\nFPS: " + (1000/dt).toFixed(2) + 
            "\nPacman Angle: " + theta.toFixed(2);
        ;

        // 3) step the physics world
        this.world?.step(FIXED_TIME_STEP, dt/1000, MAX_SUB_STEPS);

        // 4) render updates
        for (let i = 0; i < this.p2Bodies.length; i++) {
            const p2Body = this.p2Bodies[i];
            const phaserShape = this.phaserShapes[i];

            const x = p2Body?.interpolatedPosition[0];
            const y = p2Body?.interpolatedPosition[1];
            const rot = p2Body?.interpolatedAngle;
            if (x && y) {
                phaserShape.x = ConvertP2.xToPhaser(x, P2_GAME_WIDTH, this.scale);
                phaserShape.y = ConvertP2.yToPhaser(y, P2_GAME_HEIGHT, this.scale);
                phaserShape.angle = ConvertP2.radToPhaserAngle(rot);
            }
        }

        // update player sprite
        this.playerSprite.x = ConvertP2.xToPhaser(this.playerBody.interpolatedPosition[0], P2_GAME_WIDTH, this.scale);
        this.playerSprite.y = ConvertP2.yToPhaser(this.playerBody.interpolatedPosition[1], P2_GAME_HEIGHT, this.scale);
        this.playerSprite.angle = ConvertP2.radToPhaserAngle(theta);
    }
}