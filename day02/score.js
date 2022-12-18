const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	var values = [1, 2, 3];
	var oppo = ["A", "B", "C"];
	var me = ["X", "Y", "Z"];

	var scores = {
		"0": 3,
		"-1": 0,
		"1": 6,
		"2": 0,
		"-2": 6
	};

	let total = 0;
	for await (const line of rl) {
		const play = line.split(" ");
		const io = oppo.indexOf(play[0]);
		const im = me.indexOf(play[1]);
		total += (values[im] + scores[im - io]);
	}

	console.log(total);
}


processLineByLine();
