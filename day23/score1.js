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

	const moveCheck = [
		[1,0], [0,1], [-1,0], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]
	];

	const dirs = [
		[[-1, 0], [-1, -1], [-1, 1]],
		[[1, 0], [1, -1], [1, 1]],
		[[0, -1], [-1, -1], [1, -1]],
		[[0, 1], [-1, 1], [1, 1]]
	];

	const map = {};
	let count = 0;

	for await (const line of rl) {
		map[count] = {};
		line.split("").forEach((c, i) => {
			map[count][i] = c;
		});
		count++;
	}


	let gci = 0;
	let targets = {};

	let round = 0;

	while (true) {
		Object.keys(map).forEach((x) => {
			Object.keys(map[x]).forEach((y) => {
				if (map[x][y] !== "#") {
					return;
				}

				x = parseInt(x);
				y = parseInt(y);

				const canMove = moveCheck.some((dir) => {
					let nx = x + dir[0];
					let ny = y + dir[1];

					return map[nx] && map[nx][ny] === "#";
				});

				if (!canMove) {
					return;
				}


				for (let j = 0; j < dirs.length; j++) {
					let ci = (gci + j) % dirs.length;
					const move = dirs[ci].every((dir) => {
						let nx = x + dir[0];
						let ny = y + dir[1];

						return !map[nx] || map[nx][ny] !== "#";
					});

					if (!move) {
						continue;
					} 


					let nx = x + dirs[ci][0][0];
					let ny = y + dirs[ci][0][1];

					let key = nx + "," + ny;


					targets[key] = targets[key] || [];
					targets[key].push([x, y]);
					break;
				}
			});
		});

		let someMoved = false;

		Object.keys(targets).forEach((key) => {
			if (targets[key].length > 1) {
				return;
			}

			someMoved = true;

			const newPos = key.split(",").map((c) => {
				return parseInt(c);
			});

			let x = targets[key][0][0];
			let y = targets[key][0][1];

			let nx = newPos[0];
			let ny = newPos[1];

			map[nx] = map[nx] || {};
			map[nx][ny] = "#";
			map[x][y] = ".";
		});

		targets = {};

		gci = (gci + 1) % dirs.length;

		round++;

		if (!someMoved) {
			break;
		}
	}

	console.log(round);
}

processLineByLine();
