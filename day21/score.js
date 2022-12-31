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

	const map = new Map();

	for await (const line of rl) {
		const parts = line.split(": ");
		if (parts[1].indexOf(" ") !== -1) {
			const operation = parts[1].split(" ");
			map.set(parts[0], operation);
		} else {
			map.set(parts[0], parseInt(parts[1]));
		}
	}

	const calc = (name) => {
		const v = map.get(name);

		if (!Array.isArray(v)) {
			return v;
		}

		switch (v[1]) {
			case "+":
				return calc(v[0]) + calc(v[2]);
			case "-":
				return calc(v[0]) - calc(v[2]);
			case "*":
				return calc(v[0]) * calc(v[2]);
			case "/":
				return calc(v[0]) / calc(v[2]);
		}
	}

	const result = calc("root");
	console.log(result);
}

processLineByLine();
