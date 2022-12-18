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
	for await (const line of rl) {
		console.log(line);
		const l = line.length;
		let fh = {};
		let combined = {}
		for (let i = 0 ; i < l / 2 ; i++) {
			fh[line[i]] = true;
		}
		for (let i = l / 2 ; i < l; i++) {
			if (fh[line[i]]) {
				combined[line[i]] = true;
			}
		}

		const dup = Object.keys(combined);
		console.log(dup);

		total = dup.reduce((acc, l) => {
			return acc + prio(l);
		}, total);
	}

	console.log(total);
}


processLineByLine();
