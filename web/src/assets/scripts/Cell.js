export class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        
        // 转化到ctx坐标（r, c) -> (y, x)
        this.x = c + 0.5;
        this.y = r + 0.5;
    }
}