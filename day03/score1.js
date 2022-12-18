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
	let m;
	let index = 0;
	for await (const line of rl) {
		if (index % 3 === 0) {
			m = {};
			line.split("").forEach((l) => {
				m[l] = true;
			});
		} else {
			m = line.split("").reduce((acc, l) => {
				if (m[l]) {
					acc[l] = true;
				}

				return acc;
			}, {});
		}

		if (index % 3 === 2) {
			console.log(m);
			total += prio(Object.keys(m)[0]);
		}

		index++;
	}
	console.log(total);
}


processLineByLine();
