import Phaser from "phaser";

const xToPhaser = (p2_x: number, p2_width: number, phaser_scale: Phaser.Scale.ScaleManager) => {
    const { width } = phaser_scale;

    return p2_x * width / p2_width;
}

const yToPhaser = (p2_y: number, p2_height: number, phaser_scale: Phaser.Scale.ScaleManager) => {
    const { height } = phaser_scale;

    return height - p2_y * height / p2_height;
}

const dimToPhaser = (p2_dim: number, p2_width: number, phaser_scale: Phaser.Scale.ScaleManager) => {
    const { width } = phaser_scale;

    return p2_dim * width / p2_width;
}

const radToPhaserAngle = (p2_rad: number) => {
    p2_rad = p2_rad % (2*Math.PI);
    if (p2_rad < 0) {
        p2_rad += (2*Math.PI);
    }
    return Phaser.Math.RadToDeg(-p2_rad);
}

export { xToPhaser, yToPhaser, dimToPhaser, radToPhaserAngle };