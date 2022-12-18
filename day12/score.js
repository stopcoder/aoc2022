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

	const g = [];
	let row = 0;
	let start;
	let end;
	const mem = [];
	for await (const line of rl) {
		g.push(line.split(""));
		mem.push(Array(g[row].length));

		let column = g[row].indexOf("S");
		if (column !== -1) {
			start = [row, column];
			g[row][column] = "a";
		}

		column = g[row].indexOf("E");
		if (column !== -1) {
			end = [row, column];
			g[row][column] = "z";
		}

		row++;
	}

	const que = new PriorityQueue(
		// initialize the incoming arr, the complexity of doing so is O(n)
		[[...start, 0]],
		// this will create a small root heap, the default is a large root heap
		(x, y) => {return x[2] - y[2]}
	);

	const visited = new Set();

	console.log(start);

	const getNeighbours = (r, c) => {
		const dirs = [[1,0], [0,1], [-1,0], [0,-1]];
		const h1 = g[r][c].charCodeAt(0);
		const coords = [];
		dirs.forEach((delta) => {
			const nr = r + delta[0];
			const nc = c + delta[1];
			if (nr >= 0 && nr < g.length && nc >= 0 && nc < g[nr].length) {
				const h2 = g[nr][nc].charCodeAt(0);
				if ((h2 - h1 <= 1)) {
					coords.push([nr, nc]);
				}
			}
		});

		return coords;
	};

	let v;
	while (v = que.pop()) {
		if (v[0] === end[0] && v[1] === end[1]) {
			break;
		}

		let key = `(${v[0]},${v[1]})`;
		if (visited.has(key)) {
			continue;
		} else {
			visited.add(`(${v[0]},${v[1]})`);
			getNeighbours(v[0], v[1]).forEach((coord) => {
				que.push([coord[0], coord[1], v[2] + 1]);
			});
		}
	}

	console.log(v[2]);
}

processLineByLine();
