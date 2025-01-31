import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];    // 存放蛇的身体，cells[0]存放蛇头
        this.next_cell = null; // 存放下一个要移动到的格子

        this.speed = 5; // 蛇的速度，每秒移动 5 个格子
        this.direction = -1; // -1表示没有指令, 0、1、2、3分别表示上下左右
        this.status = 'idle'; // idle 静止，move 移动，die 死亡
        // if (this.id === 1) this.direction = 1;  // id 为 1 的蛇初始方向向下

        this.dr = [-1, 0, 1, 0];    // 4个方向行的偏移量
        this.dc = [0, 1, 0, -1];    // 4个方向列的偏移量
        
        this.step = 0; // 表示回合数
        this.eps = 1e-2; // 允许的误差

        // 初始化蛇眼睛的方向
        this.eye_direction = 0; // id 为 0 的蛇初始方向向上
        if (this.id === 1) this.eye_direction = 2;  // id 为 1 的蛇初始方向向下

        this.eye_dx = [ // 蛇眼在x轴不同方向上的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1]
        ];
        this.eye_dy = [ // 蛇眼在y轴不同方向上的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1]
        ]
    }

    start() {

    }

    set_direction(d) { // 设置蛇的移动方向
        this.direction = d;
    }

    check_tail_increasing() {   // 检查当前回合，蛇是否需要变长
        if (this.step <= 10) return true;    // 前 10 回合一直边长
        if (this.step % 3 === 1) return true;   // 10 回合后，每 3 回合变长一次
        return false;
    }

    next_step() { // 将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d; // 更新蛇眼睛的方向
        
        this.direction = -1; // 清空方向
        this.status = 'move';
        this.step ++;

        const k = this.cells.length;
        for (let i = k; i > 0; i --) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        // console.log(this.gamemap.check_valid(this.next_cell));
        // if (!this.gamemap.check_valid(this.next_cell)) {
        //     this.status = 'die';
        // }
    }

    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.eps) {  // 走到目标点了
            this.cells[0] = this.next_cell; // 更新蛇头位置
            this.next_cell = null;
            this.status = 'idle';   // 走完了，停下来

            if (!this.check_tail_increasing()) {
                this.cells.pop(); // 蛇不变长，就砍掉蛇尾
            }
        } else {
            const move_distance = this.speed * this.timedelta / 1000; // 每两帧间走的距离
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if(!this.check_tail_increasing()) { // 如果不变长，移动蛇尾
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x, tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {
        if (this.status === 'move') {
            this.update_move();
        }
        
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        if (this.status === 'die') {
            ctx.fillStyle = 'white';
        }

        // 画蛇，圆
        for (const cell of this.cells)
        {
            ctx.beginPath();    
            ctx.arc(cell.x * L, cell.y * L, 0.8 * L / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        //  用矩形填充两个圆之间
        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
                continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        // 画蛇的眼睛
        ctx.fillStyle = 'black';
        for (let i = 0; i < 2; i ++)
        {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, 0.1 * L / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}