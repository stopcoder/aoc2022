const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const prio = (l) => {
		if (l.charCodeAt(0) > 96) {
			return l.charCodeAt(0) - 96;
		} else {
			return l.charCodeAt(0) - 38;
		}
	};

	let total = 0;
	for await (let line of rl) {
		line = line.replace(/-/g, ",");
		const r = line.split(",").map((s) => {
			return parseInt(s);
		});

		if (
			(r[2] <= r[1]) &&
			(r[0] <= r[3])
		) {
			total++;
		}
	}

	console.log(total);
}


processLineByLine();
