import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';


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

	const d = [];
	const p = [];
	let i = 0;
	let zero;

	for await (const line of rl) {
		d.push(parseInt(line));
		p.push(i);
		if (d[i] === 0) {
			zero = i;
		}
		i++;
	}

	const l = d.length;

	const print = () => {
		const n = [];
		
		for (let i = 0; i < l; i++) {
			n[p[i]] = d[i];
		}

		console.log(n.join(", "));
	};


	for (i = 0; i < p.length; i++) {
		const curPos = p[i];
		let number = d[i];

		if (number === 0) {
			continue;
		}

		let newPos = curPos + number;
		if (newPos >= l) {
			newPos = newPos % (l - 1);
		} else if (newPos < 0) {
			newPos = newPos % (l - 1);
			newPos = newPos + l - 1;
		}

		/*
		const validMove = (number % l);

		let delta;
		if (validMove < 0) {
			delta = l - 1 + validMove;
		} else {
			delta = validMove;
		}
		const newPos = (curPos + delta) % l;
		*/

		let min, max;
		if (newPos >= curPos) {
			min = curPos + 1;
			max = newPos;
			for (let j = 0; j < p.length; j++) {
				if (p[j] >= min && p[j] <= max) {
					p[j]--;
				}
			}
		} else {
			min = newPos;
			max = curPos - 1;
			for (let j = 0; j < p.length; j++) {
				if (p[j] >= min && p[j] <= max) {
					p[j]++;
				}
			}
		}

		p[i] = newPos;
		//print();
	}

	const pZero = p[zero];
	const result = [1000, 2000, 3000].reduce((acc, dis) => {
		const pos = (pZero + dis) % l;
		const i = p.indexOf(pos);
		console.log(d[i]);
		return acc + d[i];
	}, 0);

	console.log(result);

}

processLineByLine();
