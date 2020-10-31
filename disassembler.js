#!/usr/bin/env node

const fs = require('fs');

const opcode_names = ['halt', 'set', 'push', 'pop', 'eq', 'gt', 'jmp',' jt', 'jf',
                    'add', 'mult', 'mod', 'and', 'or', 'not', 'rmem', 'wmem',
                    'call', 'ret', 'out', 'in', 'noop'];
const nb_args = [0, 2, 1, 1, 3, 3, 1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 1, 0, 1, 1, 0];


function get_repr(number) {
    if (number < 32768) {
        return String(number);
    } else if (number < 32776) {
        return "%" + String.fromCharCode(0x61 + number - 32768);
    } else {
        console.log("Error ! Value invalid: " + number);
    }
}

function print_instr(memory, eip) {
    let opcode = memory[eip];
    let repr = String(eip).padStart(6) + ' '.repeat(6);

    if (opcode >= opcode_names.length) {
        repr += String(opcode).padStart(26);
        return {'repr': repr, 'eip': eip+1};
    }

    let args = [];
    for (let i=0; i<nb_args[opcode]; ++i)
        args.push(memory[eip+1+i]);

    let hex_repr = opcode + (args.length ? '-' : '') + args.join('-');
    repr += hex_repr.padStart(26);
    repr += ' '.repeat(8);
    if (opcode == 19) {
        repr += opcode_names[opcode].padStart(4) + ' ' + String.fromCharCode(args[0]);
    } else {
        repr += opcode_names[opcode].padStart(4) + (args.length ? ' ' : '') + args.map(get_repr).join(' ');
    }

    return {'repr': repr, 'eip': eip+args.length+1};
}

function disassemble(memory, write) {

    let disassembled = [];

    let eip = 0;
    while (eip < memory.length) {
        let out = print_instr(memory, eip);
        disassembled.push(out.repr);
        eip = out.eip;
    }

    if (write)
        fs.writeFileSync('challenge.asm', disassembled.join('\n'));
}


if (require.main == module) {

    let data = fs.readFileSync('challenge.bin');

    let memory = [];
    for (let i=0; i<data.length; i+=2) {
        let opcode = (data[i+1] << 8) + data[i];
        memory.push(opcode);
    }

    disassemble(memory, true);
}

module.exports = {
    'print_instr': print_instr,
    'disassemble': disassemble,
}
