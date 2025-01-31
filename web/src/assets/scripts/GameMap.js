import { AcGameObject} from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";

export class GameMap extends AcGameObject{
    constructor(ctx, parent, store) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        
        this.L = 0;
        this.rows = 13;
        this.cols = 14;

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: '#4776EC', r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: '#F94748', r: 1, c: this.cols - 2}, this)
        ];
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth/this.cols, this.parent.clientHeight/this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    // check_connectivity(g, sx, sy, tx, ty) {
    //     if (sx == tx && sy == ty) return true;
    //     g[sx][sy] = true;

    //     let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
    //     for (let i = 0; i < 4; i ++ ) {
    //         let x = sx + dx[i], y = sy + dy[i];
    //         if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
    //             return true;
    //     }

    //     return false;
    // }

    // 创建墙壁
    create_walls() {
        // // 初始化墙， false表示没有墙
        // const g = [];
        // for (let r = 0; r < this.rows; r++) {
        //     g[r] = [];
        //     for (let c = 0; c < this.cols; c++) {
        //         g[r][c] = false;
        //     }
        // }

        // // 给四周加上墙
        // for (let r = 0; r < this.rows; r++) {
        //     g[r][0] = g[r][this.cols - 1] = true;
        // }
        // for (let c = 0; c < this.cols; c++) {
        //     g[0][c] = g[this.rows - 1][c] = true;
        // }

        // // 随机生成内部障碍物
        // for (let i = 0; i < this.inner_walls_count / 2; i++) {
        //     for (let j = 0; j < 1000; j++) {
        //         let r = parseInt(Math.random() * this.rows);
        //         let c = parseInt(Math.random() * this.cols);

        //         if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue; // 如果已经有墙了，就跳过
        //         if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
        //             continue;

        //         g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true; // 设置墙
        //         break;     
        //     }
        // }

        // const copy_g = JSON.parse(JSON.stringify(g));
        // if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols -2))
        //     return false;
        const g = this.store.state.pk.gamemap;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        // return true;
    }

    add_listning_events() {
        if (this.store.state.record.is_record) {
            let k = 0;
            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;
            const interval_id = setInterval(() => {
                if (k >= a_steps.length - 1) {
                    if (loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if (loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k ++;
            }, 300);
        } else {
            this.ctx.canvas.focus();

            // const [snake0, snake1] = this.snakes;
            this.ctx.canvas.addEventListener('keydown', e => {
                let d = -1;
                if (e.key === "w") d = 0;
                else if (e.key === "d") d = 1;
                else if (e.key === "s") d = 2;
                else if (e.key === "a") d = 3;
    
                if (d >= 0) {
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move", 
                        direction: d,
                    }));
                }
                // else if (e.key === "ArrowUp") snake1.set_direction(0);
                // else if (e.key === "ArrowRight") snake1.set_direction(1);
                // else if (e.key === "ArrowDown") snake1.set_direction(2);
                // else if (e.key === "ArrowLeft") snake1.set_direction(3);
            })
        }
    }

    start() {
        // for (let i = 0; i < 1000; i++) 
        //     if (this.create_walls())
        //         break;
        this.create_walls();
        this.add_listning_events();
    }

    check_ready() {  // 判断两条蛇是否都准备好下一回合
        for (const snake of this.snakes)
        {
            if (snake.status !== 'idle') return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    check_valid(cell) {  // 检测目标位置是否合法，没有撞到身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) 
                return false;
        }
        
        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {   // 蛇的长度不增加，蛇尾会前进，不做判断
                k--;
            }
            // 新增的cell与每条蛇的每一个cell做判断
            for(let i = 0; i < k; i ++)
            {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }
        return true;
    }

    next_step() {   // 让两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        const color_eve = '#AAD751', color_odd = '#A2D149';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_eve;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}