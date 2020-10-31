
const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const maze = [['22', '-', '9', '*'],
              ['+', '4', '-', '18'],
              ['4', '*', '11', '*'],
              ['*', '8', '-',  '1']];

function valid(x, y) {
    return (0 <= x && x <= 3 && 0 <= y && y <= 3 && (x != 0 || y != 0));
}

let init_position = {
    value: 22,
    x: 0,
    y: 0,
    step: 0,
    op: '',
    parents: [],
}
let positions = [init_position];

while (true) {
    let curr_pos = positions.shift();

    if (curr_pos.x == 3 && curr_pos.y == 3) {
        if (curr_pos.value == 30) {
            process.stdout.write("Found ! " + String(init_position.value));
            for (let pos of curr_pos.parents) {
                process.stdout.write(pos.op);
            }
            process.stdout.write(curr_pos.op + ' = 30\n');
            break;
        } else {
            continue;
        }
    }

    for (let dir of directions) {
        let new_x = curr_pos.x + dir[1];
        let new_y = curr_pos.y + dir[0];
        if (!valid(new_x, new_y))
            continue;

        let new_pos = {
            x: new_x,
            y: new_y,
            step: curr_pos.step+1,
            op: maze[new_y][new_x],
            parents: curr_pos.parents.concat(curr_pos),
        };
        if (curr_pos.step % 2 == 0) {
            new_pos.value = curr_pos.value;
        } else {
            new_pos.value = eval(curr_pos.value + curr_pos.op + maze[new_y][new_x]);
        }

        if (0 < new_pos.value && new_pos.value < 80)
            positions.push(new_pos);
    }
}

