const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let total = 0;
	const deers = [];

	for await (const line of rl) {
		if (line === "") {
			deers.push(total);
			total = 0;
		} else {
			total += parseInt(line);
		}
	}

	console.log(Math.max.apply(null, deers));
}


processLineByLine();
