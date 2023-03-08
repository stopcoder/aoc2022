import * as fs from 'fs';
import * as readline from 'readline';

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const stacks = [
		[
			"B", "L", "D", "T", "W", "C", "F", "M"
		],
		[
			"N", "B", "L"
		],
		[
			"J", "C", "H", "T", "L", "V"
		],
		[
			"S", "P", "J", "W"
		],
		[
			"Z", "S", "C", "F", "T", "L", "R"
		],
		[
			"W", "D", "G", "B", "H", "N", "Z"
		],
		[
			"F", "M", "S", "P", "V", "G", "C", "N"
		],
		[
			"W", "Q", "R", "J", "F", "V", "C", "Z"
		],
		[
			"R", "P", "M", "L", "H"
		]
	];

	let index = 0;
	const steps = [];
	for await (let line of rl) {
		if (line.indexOf("move") !== -1) {
			steps.push(line.replace(/[a-zA-Z]/g, "").split("  ").map((s)=>{return parseInt(s)}))
		}
		index++;
	}

	steps.forEach((ins) => {
		const count = ins[0];
		const from = ins[1] - 1;
		const fromLength = stacks[from].length;
		const to = ins[2] - 1;
		for (let i = count; i > 0; i--) {
			stacks[to].push(stacks[from][fromLength - i]);
		}

		stacks[from].splice(fromLength - count, count);
	});

	const result = stacks.reduce((acc, stack) => {
		return acc + stack[stack.length - 1];
	}, "");

	console.log(result);

}


processLineByLine();
