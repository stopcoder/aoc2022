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

	let node;
	let stack = [];
	let root;
	for await (const line of rl) {
		if (line.indexOf("$ cd") === 0) {
			if (line.substring(5) === "..") {
				stack.pop();
				node = stack[stack.length - 1];
			} else {
				node = {
					files: [],
					dirs: [],
					name: line.substring(5)
				};

				if (stack.length > 0) {
					node.parent = stack[stack.length - 1];
					const pos = node.parent.dirs.indexOf(node.name);
					node.parent.dirs.splice(pos, 1, node);
				} else {
					root = node;
				}
				stack.push(node);
			}
		} else if (line.indexOf("$ ls") === -1) {
			if (line.indexOf("dir ") === 0) {
				node.dirs.push(line.substring(4));
			} else {
				let parts = line.split(" ");
				node.files.push({
					name: parts[1],
					size: parseInt(parts[0])
				});
			}
		}
	}

	let total = 0;
	const visited = {};
	const size = (node) => {
		const fileSize = node.files.reduce((acc, file) => {
			return acc + file.size;
		}, 0);

		const dirSize = node.dirs.reduce((acc, dir) => {
			return acc + size(dir);
		}, 0);

		node.size = fileSize + dirSize;

		if (node.size <= 100000) {
			total += node.size;
		}

		console.log(node.name + ": " + node.size);
		visited[node.name] = true;

		return node.size;
	};

	size(root);

	console.log(Object.keys(visited).length);

	console.log(total);

}

processLineByLine();
