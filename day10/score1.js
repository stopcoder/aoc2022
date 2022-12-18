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

	const timeline = [1];
	let reg = 1;
	for await (const line of rl) {
		if (line === "noop") {
			timeline.push(reg);
		} else {
			const parts = line.split(" ");
			timeline.push(reg);
			reg = reg + parseInt(parts[1]);
			timeline.push(reg);
		}
	}

	let s = "";
	for (let i = 0 ; i < 240; i++) {
		if (Math.abs(timeline[i] - i % 40) <= 1) {
			s+="#";
		} else {
			s+="."
		}
	}

	for (let i = 0; i < 6; i++) {
		console.log(s.substring(i * 40, (i+1) * 40));
	}
}

processLineByLine();
