import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';

const { find_path, single_source_shortest_paths } = dijkstra;

const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

/*
const arr = [1, 2, 3, 4, 5];
const que = new PriorityQueue(
    // initialize the incoming arr, the complexity of doing so is O(n)
    arr,
    // this will create a small root heap, the default is a large root heap
    (x, y) => x - y
);
console.log(que.pop());
*/

/*
const graph = {
	a: {b: 10, c: 100, d: 1},
	b: {c: 10},
	d: {b: 1, e: 1},
	e: {f: 1},
	f: {c: 1},
	g: {b: 1}
};
// All paths from 'a'
const paths = single_source_shortest_paths(graph, 'a');
console.log(paths);
*/

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const parse = (line, start) => {
		const result = [];
		let number = "";
		let index = start + 1;
		let c;

		while ((c = line[index]) !== "]") {
			if (c === ",") {
				result.push(typeof number === "string" ? parseInt(number) : number);
				number = "";
			} else if (c === '[') {
				let r = parse(line, index);
				index = r.end;
				number = r.result;
			} else {
				number += c;
			}
			index++;
		}

		if (number) {
			result.push(typeof number === "string" ? parseInt(number) : number);
		}

		return {
			end: index,
			result: result
		};
	};

	const check = (left, right) => {
		const ll = Array.isArray(left);
		const rl = Array.isArray(right);

		if (!ll && !rl) {
			if (left < right) {
				return 1;
			} else if (left > right) {
				return -1;
			} else {
				return 0;
			}
		} else if (ll && rl) {
			for (let i = 0; i < Math.max(left.length, right.length); i++) {
				if (i === left.length) {
					return 1;
				} else if (i === right.length) {
					return -1;
				} else {
					let result = check(left[i], right[i]);
					if (result) {
						return result;
					}
				}
			}
			return 0;
		} else {
			if (!ll) {
				left = [left];
			}
			if (!rl) {
				right = [right];
			}

			return check(left, right);
		}
	};

	let pair = [];
	let index = 0;
	let result;
	let sum = 0;
	for await (const line of rl) {
		if (line) {
			pair.push(parse(line, 0).result);
		} else {
			result = check(pair[0], pair[1]);
			if (result === 1) {
				sum += (index + 1);
			}
			pair = [];
			index++;
		}
	}

	result = check(pair[0], pair[1]);
	if (result === 1) {
		sum += (index + 1);
	}

	console.log(sum);
}

processLineByLine();
