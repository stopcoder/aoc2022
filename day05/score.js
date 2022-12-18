import fs from 'fs';
import readline from 'readline';
import { OrderedMap, PriorityQueue, LinkList, Deque } from 'js-sdsl';


const arr = [1, 2, 3, 4, 5];
const que = new PriorityQueue(
    // initialize the incoming arr, the complexity of doing so is O(n)
    arr,
    // this will create a small root heap, the default is a large root heap
    (x, y) => x - y
);

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

	const steps = [];
	for await (const line of rl) {
		if (line.indexOf("move") !== -1) {
			steps.push(line.replace(/[a-zA-Z]/g, "").split("  ").map((s) => {
				return parseInt(s);
			}));
		}
	}

	steps.forEach((ins) => {
		for (let i = 0; i < ins[0]; i++) {
			stacks[ins[2] - 1].push(stacks[ins[1] - 1].pop());
		}
	});

	const result = stacks.reduce((acc, stack) => {
		return acc + stack[stack.length - 1];
	}, "");

	console.log(result);
}

processLineByLine();
