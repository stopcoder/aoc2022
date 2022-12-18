const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const check = (s) => {
		let o = s.split("").reduce((acc, c) => {
			acc[c] = true;
			return acc;
		}, {});

		return Object.keys(o).length;
	};
	for await (let line of rl) {
		let i;
		for (i = 0 ; i < line.length - 14; i++) {
			const unique = check(line.substring(i, i+14));
			if (unique === 14) {
				break;
			}
		}

		console.log(i+14);
	}
}


processLineByLine();
