#!/usr/bin/env node

const fs = require('fs');
const reader = require('readline-sync');
const dis = require('./disassembler')

const SAVE_FILE = "challenge.save";


class Program {

    constructor(memory, save_file) {
        this.memory = memory;
        this.save_file = save_file;

        this.registers = [0, 0, 0, 0, 0, 0, 0, 0];
        this.stack = [];

        this.input = "";

        this.eip = 0;
        this.running = true;

        // Debugger
        this.breakpoints = [];
        this.tmp_breakpoints = [];
        this.last_command = "";
        this.debug_step = false;
    }

    get_value(number) {
        if (number < 32768) {
            return number;
        } else if (number < 32776) {
            return this.registers[number - 32768];
        } else {
            console.log("Error ! Value invalid: " + number);
            return -1;
        }
    }

    save() {
        console.log("Saving...");
        fs.writeFileSync(this.save_file, JSON.stringify(this));
    }

    load() {
        if (fs.existsSync(this.save_file)) {
            console.log("Loading file...")
            let object = JSON.parse(fs.readFileSync(this.save_file));
            this.memory = object.memory;
            this.registers = object.registers;
            this.stack = object.stack;
            this.eip = object.eip;
            this.input = "look\n";
        }
    }

    run() {
        while (this.running)
            this.step();
    }

    step() {
        let a = this.memory[this.eip+1];
        let b = this.memory[this.eip+2];
        let c = this.memory[this.eip+3];


        if (this.breakpoints.includes(this.eip) || this.tmp_breakpoints.includes(this.eip) || this.debug_step) {
            if (this.tmp_breakpoints.includes(this.eip))
                this.tmp_breakpoints = this.tmp_breakpoints.filter((item) => { return item != this.eip; });

            let instr = this.eip;
            for (let i=0; i<3; ++i) {
                let out = dis.print_instr(this.memory, instr);
                console.log(out.repr);
                instr = out.eip;
            }

            process.stdout.write("Registers: ");
            for (let i=0; i<this.registers.length; ++i) {
                let s = String.fromCharCode(0x61+i) + '=' + String(this.registers[i]).padEnd(5) + '    ';
                process.stdout.write(s);
            }
            console.log("\nStack: " + this.stack.join(', '));
            console.log();

            let cmd = reader.question('$ ');
            if (!cmd)
                cmd = this.last_command;
            this.last_command = cmd;

            let debug_args = cmd.split(' ').splice(1);
            if (cmd.startsWith("info")) {
                console.log("Breaks: " + this.breakpoints);
                console.log("Tmp breaks: " + this.tmp_breakpoints + "\n\n");
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("del")) {
                this.breakpoints = this.breakpoints.filter((item) => { return item != Number(debug_args[0]); });
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("set")) {
                let reg = debug_args[0].charCodeAt(0) - 0x61;
                let value = Number(debug_args[1]);
                if (0 <= reg && reg <= this.registers.length)
                    this.registers[reg] = value;
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("xo")) {
                let addr = Number(debug_args[0]);
                let name_addr = this.memory[addr];
                let descr_addr = this.memory[addr+1];
                let obtained = this.memory[addr+2];

                process.stdout.write('Object: ');
                let name_length = this.memory[name_addr];
                for (let i=0; i<name_length; ++i)
                    process.stdout.write(String.fromCharCode(this.memory[name_addr+i+1]));
                process.stdout.write(' :: ');
                let descr_length = this.memory[descr_addr];
                for (let i=0; i<descr_length; ++i)
                    process.stdout.write(String.fromCharCode(this.memory[descr_addr+i+1]));
                console.log();

                this.debug_step = true;
                return;

            } else if (cmd.startsWith("xs")) {
                let addr = Number(debug_args[0]);
                let length = this.memory[addr];
                process.stdout.write('\t\t\t`');
                for (let i=0; i<length; ++i)
                    process.stdout.write(String.fromCharCode(this.memory[addr+i+1]));
                console.log('`');
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("tb")) {
                this.tmp_breakpoints.push(Number(debug_args[0]));
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("b")) {
                this.breakpoints.push(Number(debug_args[0]));
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("j")) {
                this.eip = Number(debug_args[0]);
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("w")) {
                let address = Number(debug_args[0]);
                let value = Number(debug_args[1]);
                this.memory[address] = value;
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("l")) {
                let address = Number(debug_args[0]);
                for (let i=0; i<5; ++i) {
                    let out = dis.print_instr(this.memory, address);
                    console.log(out.repr);
                    address = out.eip;
                }
                console.log("\n\n");
                this.debug_step = true;
                return;

            } else if (cmd.startsWith("s")) {
                this.debug_step = true;

            } else if (cmd.startsWith("n")) {
                this.tmp_breakpoints.push(dis.print_instr(this.memory, this.eip).eip);
                this.debug_step = false;

            } else {
                this.debug_step = false;
            }
        }

        switch (this.memory[this.eip]) {
            case 0:     // halt
                this.running = false;
                break;

            case 1:     // set
                this.registers[a-32768] = this.get_value(b);
                this.eip += 3;
                break;

            case 2:     // push
                this.stack.push(this.get_value(a));
                this.eip += 2;
                break;

            case 3:     // pop
                if (!this.stack.length) {
                    console.log("Error ! Empty stack, can't pop");
                    this.running = false;
                } else {
                    this.registers[a-32768] = this.stack.pop();
                }
                this.eip += 2;
                break;

            case 4:     // eq
                this.registers[a-32768] = Number(this.get_value(b) == this.get_value(c));
                this.eip += 4;
                break;

            case 5:     // gt
                this.registers[a-32768] = Number(this.get_value(b) > this.get_value(c));
                this.eip += 4;
                break;

            case 6:     // jmp
                this.eip = this.get_value(a);
                break;

            case 7:     // jt
                if (this.get_value(a)) {
                    this.eip = this.get_value(b);
                } else {
                    this.eip += 3;
                }
                break;

            case 8:     // jf
                if (!this.get_value(a)) {
                    this.eip = this.get_value(b);
                } else {
                    this.eip += 3;
                }
                break;

            case 9:     // add
                this.registers[a-32768] = (this.get_value(b) + this.get_value(c)) % 32768;
                this.eip += 4;
                break;

            case 10:     // mult
                this.registers[a-32768] = (this.get_value(b) * this.get_value(c)) % 32768;
                this.eip += 4;
                break;

            case 11:     // mod
                this.registers[a-32768] = this.get_value(b) % this.get_value(c);
                this.eip += 4;
                break;

            case 12:     // and
                this.registers[a-32768] = this.get_value(b) & this.get_value(c);
                this.eip += 4;
                break;

            case 13:     // or
                this.registers[a-32768] = this.get_value(b) | this.get_value(c);
                this.eip += 4;
                break;

            case 14:     // not
                this.registers[a-32768] = (~this.get_value(b)) & 0x7fff;
                this.eip += 3;
                break;

            case 15:     // rmem
                this.registers[a-32768] = this.memory[this.get_value(b)];
                this.eip += 3;
                break;

            case 16:     // wmem
                this.memory[this.get_value(a)] = this.get_value(b);
                this.eip += 3;
                break;

            case 17:    // call
                this.stack.push(this.eip+2);
                this.eip = this.get_value(a);
                break;

            case 18:    // ret
                if (!this.stack.length) {
                    console.log("Error ! Empty stack, can't ret");
                    this.running = false;
                } else {
                    this.eip = this.stack.pop();
                }
                break;

            case 19:    // out
                process.stdout.write(String.fromCharCode(this.get_value(a)));
                this.eip += 2;
                break;

            case 20:    // in
                if (this.input) {
                    this.registers[a-32768] = this.input.charCodeAt();
                    this.input = this.input.slice(1);
                    this.eip += 2;
                } else {
                    this.input = reader.question('-> ') + '\n';
                    if (this.input == "save\n") {
                        this.save();
                        this.input = "";
                    }

                    if (this.input == "break\n" || this.input == "debug\n") {
                        this.debug_step = true;
                        this.input = "";
                    }

                    if (this.input.startsWith("dis")) {
                        dis.disassemble(this.memory.slice(), true);
                        this.input = "";
                    }

                    if (this.input == "quit\n" || this.input == "exit\n")
                        this.running = false;

                }
                break;

            case 21:    // noop
                this.eip += 1;
                break;

            default:
                console.log("Error ! Opcode invalid: " + this.memory[this.eip]);
                this.running = false;
                break;
        }
    }
}


let data = fs.readFileSync('challenge.bin');

let memory = [];
for (let i=0; i<data.length; i+=2) {
    let opcode = (data[i+1] << 8) + data[i];
    memory.push(opcode);
}

let program = new Program(memory, SAVE_FILE);
program.load();

program.run();
