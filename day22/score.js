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

	const jungle = [];
	const insts = [];

	// right, down, left, up
	const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
	let finished = false;

	let maxLength = 0;

	for await (const line of rl) {
		const parts = line.split("");

		if (!finished) {
			if (!line) {
				finished = true;
				continue;
			}

			maxLength = Math.max(maxLength, parts.length);
			jungle.push(parts);
		} else {
			let dir = 0;
			let sn = "";
			parts.forEach((c) => {
				if (c === "R" || c === "L") {
					const number = parseInt(sn);
					insts.push([dir, number]);

					sn = "";

					dir = dir + (c === "R" ? 1 : -1);
					if (dir < 0) {
						dir += 4;
					} else if (dir === 4) {
						dir -= 4;
					}
				} else {
					sn += c;
				}
			});

			insts.push([dir, parseInt(sn)]);
		}
	}

	jungle.forEach((line) => {
		while (line.length < maxLength) {
			line.push(" ");
		}
	});

	let cx = 0, 
		cy = jungle[0].indexOf(".");

	for (let i = 0; i < insts.length; i++) {
		const inst = insts[i];
		const dir = inst[0];
		const step = inst[1];
		let nx = cx, ny = cy;
		let dx = dirs[dir][0];
		let dy = dirs[dir][1]
		

		for (let j = 0; j < step; j++) {
			do {
				nx = ((nx + dx) % jungle.length + jungle.length) % jungle.length;
				ny = ((ny + dy) % jungle[nx].length + jungle[nx].length) % jungle[nx].length;
			} while (jungle[nx][ny] === " ");

			if (jungle[nx][ny] === ".") {
				cx = nx;
				cy = ny;
			} else {
				break;
			}
		}
	}

	console.log(`${cx}, ${cy}`);
	console.log(1000 * (cx + 1) + 4 * (cy + 1) + insts[insts.length -1][0]);
}

processLineByLine();
