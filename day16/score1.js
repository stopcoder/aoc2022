import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';


const { find_path, single_source_shortest_paths } = dijkstra;

const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

const memorize = (fn, argLimit) => {
	const cache = new Map();
	const stats = {
		count: 0,
		cacheHit: 0
	};

	return {
		fn: function memo() {
			const key = hash(Array.prototype.slice.apply(arguments, [0, argLimit]));
			stats.count++;
			if (cache.has(key)) {
				//console.log(`hit key: ${key}`);
				stats.cacheHit++;
				return cache.get(key);
			}
			const result = fn.apply(memo, arguments);
			cache.set(key, result);
			return result;
		},
		stats: stats
	};
};

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

	const vs = {};

	for await (const line of rl) {
		const parts = line.split(" ");

		const name = parts[1];
		const rate = parseInt(parts[4].substring(5, parts[4].length - 1));
		const nbs = parts.slice(9).map((e) => {
			return e.substring(0, 2);
		});

		vs[name] = {
			name: name,
			rate: rate,
			nbs: nbs
		};
	}

	const es = {};

	Object.keys(vs).forEach((vName) => {
		const v = vs[vName];

		if (v.name !== "AA" && v.rate === 0) {
			return;
		}

		es[v.name] = {};

		const visited = new Set();
		visited.add(v.name);
		const queue = [[v.name, 0]];
		

		while (queue.length !== 0) {
			const cur = queue.shift();

			vs[cur[0]].nbs.forEach((nb) => {
				if (visited.has(nb)) {
					return;
				}
				visited.add(nb);
				queue.push([nb, cur[1] + 1]);
				if (vs[nb].rate > 0) {
					es[v.name][nb] = cur[1] + 1;
				}
			});
		}
	});

	const solve = function (c, time, opened, elephant) {
		console.log(`${c} ${time} ${opened}`);
		let value = 0;
		Object.keys(es[c]).forEach((nb) => {
			if (opened.indexOf(nb) !== -1) {
				return;
			}
			let remain = time - es[c][nb] - 1;
			if (remain <= 0) {
				if (!elephant) {
					value = Math.max(value, this("AA", 26, opened, true));
				} else {
					return;
				}
			} else {
				const openedCopy = opened.slice();
				openedCopy.push(nb);
				openedCopy.sort();
				value = Math.max(value, this(nb, remain, openedCopy, elephant) + vs[nb].rate * remain);
			}
		});

		return value;
	}

	const memoSolve = memorize(solve, 4);
	console.log(memoSolve.fn("AA", 26, [], false));
	console.log(memoSolve.stats);
}

processLineByLine();
