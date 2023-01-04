import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';
import lcm from 'lcm';


const { find_path, single_source_shortest_paths } = dijkstra;
const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

const memorize = (fn) => {
	const cache = new Map();
	return function() {
		const key = hash(Array.prototype.slice.apply(arguments));
		if (cache.has(key)) {
			console.log(`hit key: ${key}`);
			return cache.get(key);
		}
		const result = fn.apply(null, arguments);
		cache.set(key, result);
		return result;
	};
};

const test = (a, b, c) => {
	return a[0] + b.b + c;
};

const memoTest = memorize(test);

memoTest([1, 2, 3], {b: {a: 1}}, "test");
memoTest([1, 2, 3], {b: {a: 1}}, "test");
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


async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const dirs = [[0, 0], [0, 1], [1, 0], [0, -1], [-1, 0]];
	const map = [];

	for await (const line of rl) {
		var parts = line.split("").map((c) => {
			if (c === "#") {
				return c;
			}

			if (c === ".") {
				return [];
			}

			return [c];
		});

		map.push(parts);
	}

	const repeat = lcm(map.length - 2, map[0].length - 2);

	const maps = [];

	const move = (map) => {
		const result = [];

		result.push(map[0]);
		for (let i = 1; i < map.length - 1; i++) {
			const row = Array.from({
				length: map[i].length
			}, e => []);
			row[0] = "#";
			row[row.length - 1] = "#";
			result.push(row);
		}
		result.push(map[map.length - 1]);

		for (let i = 1; i < map.length - 1; i++) {
			for (let j = 1; j < map[i].length - 1; j++) {
				const blis = map[i][j];

				let nx;
				let ny;
				blis.forEach((bli) => {
					if (bli === ">") {
						nx = i;
						ny = j + 1;
						if (ny === map[i].length - 1) {
							ny = 1;
						}
					} else if (bli === "<") {
						nx = i;
						ny = j - 1;
						if (ny === 0) {
							ny = map[i].length - 2;
						}
					} else if (bli === "v") {
						ny = j;
						nx = i + 1;
						if (nx === map.length -1) {
							nx = 1;
						}
					} else {
						ny = j;
						nx = i - 1;
						if (nx === 0) {
							nx = map.length - 2;
						}
					}

					result[nx][ny].push(bli);
				});
			}
		}

		return result;
	};

	maps.push(map);
	for (let i = 1; i < repeat; i++) {
		maps.push(move(maps[i - 1]));
	}

	const print = (map, x, y) => {
		for (let i = 0; i < map.length; i++) {
			let line = "";
			for (let j = 0; j < map[i].length; j++) {
				if (i === x && j === y) {
					line += "E";
					continue;
				}

				const c = map[i][j];

				if (c === "#") {
					line += c;
				} else if (c.length === 0) {
					line += "."
				} else if (c.length === 1) {
					line += c[0];
				} else {
					line += c.length;
				}
			}
			console.log(line);
		}
	};

	const que = new PriorityQueue(
		// initialize the incoming arr, the complexity of doing so is O(n)
		[[0, 1, 0]],
		// this will create a small root heap, the default is a large root heap
		(x, y) => x[2] - y[2]
	);

	const visited = new Set();

	while (que.length) {
		const elem = que.pop();
		const key = elem.join(",");
		const steps = elem[2];

		if (elem[0] === map.length - 1 && elem[1] === map[elem[0]].length - 2) {
			console.log(steps);
			break;
		}

		if (visited.has(key)) {
			continue;
		} else {
			visited.add(key);
			const nmap = maps[(steps + 1) % repeat];
			const x = elem[0];
			const y = elem[1];

			// console.log(`${x}, ${y}`);

			for (let i = 0; i < dirs.length; i++) {
				const dir = dirs[i];
				const nx = x + dir[0];
				const ny = y + dir[1];

				if (nx < 0 || nx === map.length || ny < 0 || ny === map[nx].length) {
					continue;
				}

				const c = nmap[nx][ny];

				if (c === "#" || c.length > 0) {
					continue;
				}

				que.push([nx, ny, steps + 1]);
			}
		}
	}
}

processLineByLine();
