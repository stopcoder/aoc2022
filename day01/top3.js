const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let total = 0;
	const top3 = [];

	for await (const line of rl) {
		if (line === "") {
			if (top3.length < 3) {
				top3.push(total);
				top3.sort();
			} else if (total > top3[0]) {
				top3.shift();
				top3.unshift(total);
				top3.sort();
			}
			total = 0;
		} else {
			total += parseInt(line);
		}
	}

	console.log(top3[0]+top3[1]+top3[2]);
}


processLineByLine();
