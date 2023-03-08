import * as fs from 'fs';
import * as readline from 'readline';

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let total = 0;
	let max = 0;

	for await (const line of rl) {
		if (line === "") {
			max = Math.max(max, total);
			total = 0;
		} else {
			total += parseInt(line);
		}
	}

	console.log(max);
}


processLineByLine();
