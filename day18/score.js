import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';


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

	const cubes = [];

	for await (const line of rl) {
		cubes.push(line.split(",").map((c) => {
			return parseInt(c);
		}));
	}

	const map = new Map();
	const genKey = (cube) => {
		return cube.join(",");
	};

	const dirs = [
		[0, 0, 1],
		[0, 0, -1],
		[0, 1, 0],
		[0, -1, 0],
		[1, 0, 0],
		[-1, 0, 0]
	];

	let sum = 0;
	cubes.forEach((cube) => {
		const key = genKey(cube);

		sum += (6 - 2 * (map.get(key) || 0));

		dirs.forEach((dir) => {
			const neighbour = cube.map((a, i) => {
				return a + dir[i];
			});

			const key = genKey(neighbour);
			map.set(key, (map.get(key) || 0) + 1 );
		})
	});

	console.log(sum);
}

processLineByLine();
