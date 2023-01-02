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

	const lefts = [];
	const jungle = [];
	const insts = [];

	// right, down, left, up
	const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
	let finished = false;

	for await (const line of rl) {
		const parts = line.split("");
		if (!finished) {
			if (!line) {
				finished = true;
				continue;
			}
			jungle.push(parts);

			const left = parts.findIndex((c) => {
				return c !== " ";
			});

			lefts.push(left);
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

	console.log(lefts);
	console.log(insts);

	let cx = 0, 
		cy = lefts[0];

	for (let i = 0; i < insts.length; i++) {
		const inst = insts[i];
		const dir = inst[0];
		const step = inst[1];
		let nx, ny;

		for (let j = 0; j < step; j++) {
			nx = cx + dirs[dir][0];
			ny = cy + dirs[dir][1];

			if (nx !== cx) {
				if (dirs[dir][0] === 1) {
					if (nx === jungle.length || jungle[nx][ny] === " ") {
						let tx = 0;
						while (jungle[tx][ny] === " " || jungle[tx][ny] === undefined) {
							tx++;
						}
						nx = tx;
					}
				} else {
					if (nx < 0 || jungle[nx][ny] === " ") {
						let tx = jungle.length - 1;
						while (jungle[tx][ny] === " " || jungle[tx][ny] === undefined) {
							tx--;
						}
						nx = tx;
					}
				}
			} else {
				if (ny === jungle[nx].length) {
					ny = lefts[nx];
				} else if (ny < lefts[nx]) {
					ny = jungle[nx].length - 1;
				}
			}

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
