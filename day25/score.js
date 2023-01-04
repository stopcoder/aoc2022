import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';


const { find_path, single_source_shortest_paths } = dijkstra;
const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const numbers = [];
	for await (const line of rl) {
		numbers.push(line);
	}

	let result = numbers.reduce((acc, number) => {
		let sum = 0;
		for (let i = 0; i< number.length; i++) {
			const pow = number.length - 1 - i;

			let times = "=-012".indexOf(number[i]) - 2;
			sum += (Math.pow(5, pow) * times);
		}

		return acc + sum;
	}, 0);


	let snafu = "";

	while (result !== 0) {
		let reminder = result % 5;
		result = Math.floor(result / 5);

		if (reminder <= 2) {
			snafu = "" + reminder + snafu;
		} else {
			snafu = "   =-".charAt(reminder) + snafu;
			result++;
		}
	}

	console.log(snafu);
}

processLineByLine();
