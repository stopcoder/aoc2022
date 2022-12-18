const fs = require('fs');
const readline = require('readline');

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
		const temp = [];
		for (let i = 0; i < ins[0]; i++) {
			temp.unshift(stacks[ins[1] - 1].pop());
		}
		stacks[ins[2] - 1] = stacks[ins[2] - 1].concat(temp);
	});

	const result = stacks.reduce((acc, stack) => {
		return acc + stack[stack.length - 1];
	}, "");

	console.log(result);

}


processLineByLine();
