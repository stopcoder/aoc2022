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

	let monkey = {};
	const ms = [];
	for await (const line of rl) {
		if (!line) {
			ms.push(monkey);
			monkey = {};
		} else if (line.indexOf("Starting items:") !== -1) {
			monkey.items = line.substring(18).split(", ").map((s) => {
				return parseInt(s);
			});
		} else if (line.indexOf("Operation") !== -1) {
			monkey.oprt = ((expr) => {
				const parts = expr.split(" ");

				return (v) => {
					let left = v;
					let right;
					if (parts[2] === "old") {
						right = v;
					} else {
						right = parseInt(parts[2]);
					}
					if (parts[1] === "*") {
						return left * right;
					}
					if (parts[1] === "+") {
						return left + right;
					}
				};
			})(line.substring(19));
		} else if (line.indexOf("Test: ") !== -1) {
			monkey.test = {
				divide: parseInt(line.substring("  Test: divisible by ".length))
			};
		} else if (line.indexOf("throw to monkey") !== -1) {
			if (line.indexOf("true") !== -1) {
				monkey.test.yes = parseInt(line.substring("    If true: throw to monkey ".length));
			} else {
				monkey.test.no = parseInt(line.substring("    If false: throw to monkey ".length));
			}
		}
	}
	ms.push(monkey);

	console.log(ms);
	const counts = Array(ms.length).fill(0);

	for (let i = 0; i< 20; i++) {
		ms.forEach((monkey, mi) => {
			monkey.items.forEach((worry) => {
				worry = monkey.oprt(worry);
				worry = Math.floor(worry / 3);

				if (worry % monkey.test.divide === 0) {
					ms[monkey.test.yes].items.push(worry);
				} else {
					ms[monkey.test.no].items.push(worry);
				}
			});
			counts[mi] = counts[mi] + monkey.items.length;
			monkey.items = [];
		});
	}

	counts.sort((a, b) => {return b-a;});

	console.log(counts[0] * counts[1]);
}

processLineByLine();
