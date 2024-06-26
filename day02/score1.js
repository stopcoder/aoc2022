import * as fs from 'fs';
import * as readline from 'readline';

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	var values = [1, 2, 3];
	var oppo = ["A", "B", "C"];
	var delta = {"X": -1, "Y": 0, "Z": 1};
	var scores = {"X": 0, "Y": 3, "Z": 6};

	let total = 0;
	for await (const line of rl) {
		const play = line.split(" ");
		const io = oppo.indexOf(play[0]);
		const id = delta[play[1]];

		let im = io + id;
		im = (im % 3 + 3) % 3;

		total += (values[im] + scores[play[1]]);
	}

	console.log(total);
}


processLineByLine();
