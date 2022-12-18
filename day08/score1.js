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
	for await (const line of rl) {
		f.push(line.split("").map((c) => {
			return parseInt(c);
		}));
	}

	const score = (x, y) => {
		let sum = 1;
		// up
		let base = 0;
		for (let i = x - 1; i >= 0; i--) {
			base++;
			if (f[i][y] >= f[x][y]) {
				break;
			}
		}
		sum = sum * base;
		// down
		base = 0;
		for (let i = x + 1; i < f.length; i++) {
			base++;
			if (f[i][y] >= f[x][y]) {
				break;
			}
		}
		sum = sum * base;
		// left
		base = 0;
		for (let i = y - 1; i >= 0; i--) {
			base++;
			if (f[x][i] >= f[x][y]) {
				break;
			}
		}
		sum = sum * base;
		// right
		base = 0;
		for (let i = y + 1; i < f[x].length; i++) {
			base++;
			if (f[x][i] >= f[x][y]) {
				break;
			}
		}
		sum = sum * base;
		return sum;
	};
	let max = 0;
	for (let i = 1; i < f.length - 1; i++) {
		for (let j = 1; j < f[i].length - 1; j++) {
			let s = score(i, j);
			if (s > max ) {
				max = s;
			}
		}
	}

	console.log(max);
}

processLineByLine();
