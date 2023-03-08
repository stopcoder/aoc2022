import * as fs from 'fs';
import * as readline from 'readline';

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let total = 0;
	for await (let line of rl) {
		line = line.replace(/-/g, ",");
		const r = line.split(",").map((s) => {
			return parseInt(s);
		});
		const acb = (r[0] <= r[2]) && (r[1] >= r[3]);
		const bca = (r[0] >= r[2]) && (r[1] <= r[3]);

		if (acb || bca) {
			total++;
		}
	}

	console.log(total);
}


processLineByLine();
