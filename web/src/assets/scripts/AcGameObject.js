const AC_GAME_OBJECTS = [];

export class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0;
    }

    start() {   // 只执行一次

    }

    update() {  // 每帧执行一次，除第一帧

    }

    on_destroy() {  // 删除前执行

    }

    destory() {
        this.on_destroy();

        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp;
const step = timestamp => {
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    
    last_timestamp = timestamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
