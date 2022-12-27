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

	const set = new Set();
	const genKey = (cube) => {
		return cube.join(",");
	};

	const boundaries = [100,0];
	for await (const line of rl) {
		const cube = line.split(",").map((c, index) => {
			var result = parseInt(c);

			boundaries[0] = Math.min(boundaries[0], result);
			boundaries[1] = Math.max(boundaries[1], result);
			return result;
		});
		cubes.push(cube);
		set.add(genKey(cube));
	}

	boundaries[0]--;
	boundaries[1]++;


	console.log(boundaries);

	const dirs = [
		[0, 0, 1],
		[0, 0, -1],
		[0, 1, 0],
		[0, -1, 0],
		[1, 0, 0],
		[-1, 0, 0]
	];

	const map = new Map();

	cubes.forEach((cube) => {
		const key = genKey(cube);

		dirs.forEach((dir) => {
			const neighbour = cube.map((a, i) => {
				return a + dir[i];
			});

			const key = genKey(neighbour);
			map.set(key, (map.get(key) || 0) + 1 );
		})
	});


	let start;
	const iterator = map.entries();
	let result = iterator.next();
	while (!result.done) {
		const entry = result.value;
		if (entry[1] === 1 && !set.has(entry[0])) {
			const cube = entry[0].split(",").map((c) => {
				return parseInt(c);
			});
			start = cube;
			console.log(cube);
			break;

		}
		result = iterator.next();
	}

	const queue = [start];
	const visited = new Set([genKey(start)]);

	// use queue based instead
	const check = () => {
		let sum = 0;
		while (queue.length > 0) {
			let cube = queue.shift();
			console.log(`checking ${cube}`);

			dirs.forEach((dir) => {
				const neighbour = cube.map((a, i) => {
					return a + dir[i];
				});
				const key = genKey(neighbour);

				if (neighbour[0] >= boundaries[0] && neighbour[0] <= boundaries[1] &&
					neighbour[1] >= boundaries[0] && neighbour[1] <= boundaries[1] &&
					neighbour[2] >= boundaries[0] && neighbour[2] <= boundaries[1]) {
					if (set.has(key)) {
						sum++;
					} else if (!visited.has(key)) {
						visited.add(key);
						queue.push(neighbour);
					}
				}
			});
		}

		return sum;
	};

	// recursive doesn't work because maximum call stack exceeded
	const visited2 = new Set([genKey(start)]);
	const traverse2 = (cube) => {
		let sum = 0;

		for (let i = 0; i < dirs.length; i++) {
			const dir = dirs[i];

			const neighbour = [];
			for (let j = 0; j < cube.length; j++) {
				neighbour.push(cube[j] + dir[j]);
			}

			const key = genKey(neighbour);

			if (neighbour[0] >= boundaries[0] && neighbour[0] <= boundaries[1] &&
				neighbour[1] >= boundaries[0] && neighbour[1] <= boundaries[1] &&
				neighbour[2] >= boundaries[0] && neighbour[2] <= boundaries[1]) {
				if (set.has(key)) {
					sum++;
				} else if (!visited2.has(key)){
					visited2.add(key);
					sum += (traverse2(neighbour));
				}
			}
		}

		return sum;

	};

	console.log(check());
	//console.log(traverse(start));
	//console.log(traverse2(start));


}

processLineByLine();
