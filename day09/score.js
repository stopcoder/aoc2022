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

	const f = [];
	const s = new Set();
	const push = (x, y) => {
		s.add(`(${x}, ${y})`);
	};
	for await (const line of rl) {
		let parts = line.split(" ");
		f.push([parts[0], parseInt(parts[1])]);
	}

	const diff = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const dirMap = ["D", "R", "U", "L"];

	let sx = 0;
	let sy = 0;

	let tx = 0;
	let ty = 0;
	push(tx, ty);
	f.forEach(([dir, step]) => {
		const delta = diff[dirMap.indexOf(dir)];
		for (let i = 0; i < step; i++) {
			sx += delta[0];
			sy += delta[1];

			if (sx === tx && Math.abs(sy - ty) === 2) {
				ty += ((sy - ty) / 2);
			} else if (sy === ty && Math.abs(sx - tx) === 2) {
				tx += ((sx - tx) / 2);
			} else if (sx !== tx && sy !== ty && (Math.abs(sx - tx) !== 1 || Math.abs(sy - ty) !== 1)) {
				ty += (1 * Math.abs(sy - ty) / (sy - ty));
				tx += (1 * Math.abs(sx - tx) / (sx - tx));
			}

			push(tx, ty);
		}
	});

	console.log(s.size);
}

processLineByLine();
