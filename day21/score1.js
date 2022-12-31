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

	map.delete("humn");

	const calc = (name) => {
		let v = map.get(name);

		if (typeof v === "number") {
			return v;
		}

		if (!v) {
			const iter = map.entries();
			let result = iter.next();
			while (!result.done) {
				v = result.value[1];
				if (v[0] === name || v[2] === name) {
					const left = (v[0] === name);
					map.delete(result.value[0]);

					// root: equal sign
					if (result.value[0] === "root") {
						return left ? calc(v[2]) : calc(v[0]);
					}

					// reverse the formula
					switch (v[1]) {
						case "+":
							return calc(result.value[0]) - calc(left ? v[2] : v[0]);
						case "-":
							return left ? (calc(result.value[0]) + calc(v[2])) : (calc(v[0]) - calc(result.value[0]));
						case "*":
							return calc(result.value[0]) / calc(left ? v[2] : v[0]);
						case "/":
							return left ? (calc(result.value[0]) * calc(v[2])) : (calc(v[0]) / calc(result.value[0]));
					}
				}
				result = iter.next();
			}
		} else {
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
	}

	const result = calc("humn");
	console.log(result);
}

processLineByLine();
