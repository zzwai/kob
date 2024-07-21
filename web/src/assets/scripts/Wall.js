import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.map = gamemap;
        this.color = '#B37226';
    }

    update() {
        this.render();
    }

    render() {
        const L = this.map.L;
        const ctx = this.map.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}