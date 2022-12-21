import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';

const { find_path, single_source_shortest_paths } = dijkstra;
const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const map = [];

	for await (const line of rl) {
		const parts = line.split(" -> ");

		for (let i = 1; i < parts.length; i++) {
			const p0 = parts[i-1].split(",").map((c) => {
				return parseInt(c);
			});
			const p1 = parts[i].split(",").map((c) => {
				return parseInt(c);
			});

			if (p0[0] === p1[0]) {
				const start = Math.min(p0[1], p1[1]);
				const end = Math.max(p0[1], p1[1]);

				map[p0[0]] = map[p0[0]] || [];

				for (let j = start; j <= end; j++) {
					map[p0[0]][j] = "#";
				}
			} else if (p0[1] === p1[1]){
				const start = Math.min(p0[0], p1[0]);
				const end = Math.max(p0[0], p1[0]);

				for (let j = start; j <= end; j++) {
					map[j] = map[j] || [];
					map[j][p0[1]] = "#";
				}
			} else {
				console.log("Something is wrong!");
			}
		}
	}

	const rowMax = map.reduce((acc, column) => {
		return Math.max(acc, column.length);
	}, 0) - 1;


	const fall = (row, column, count) => {
		while(map[column] === undefined || map[column][row] === undefined) {
			row++;

			if (row > rowMax) {
				return true;
			}

		}
		if (column - 1 >= 0 && (map[column-1] === undefined || map[column-1][row] === undefined)){
			return fall(row, column - 1, count);
		} else if (column + 1 < map.length && (map[column+1] === undefined || map[column+1][row] === undefined)) {
			return fall(row, column + 1, count);
		} else {
			map[column][row-1] = "*";
		}
	}

	let stop;
	let count = 0;
	do {
		count++;
		stop = fall(0, 500, count);
	} while (!stop);

	console.log(count - 1);
}

processLineByLine();
