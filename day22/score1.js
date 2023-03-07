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
			let sn = "";
			parts.forEach((c) => {
				if (c === "R" || c === "L") {
					const number = parseInt(sn);
					insts.push([number, c]);

					sn = "";
				} else {
					sn += c;
				}
			});

			insts.push([parseInt(sn)]);
		}
	}

	console.log(insts);

	jungle.forEach((line) => {
		while (line.length < maxLength) {
			line.push(" ");
		}
	});

	let cx = 0, 
		cy = jungle[0].indexOf(".");

	// initiallly to the right
	let dx = 0, dy = 1;

	for (let i = 0; i < insts.length; i++) {
		const inst = insts[i];
		const step = inst[0];
		const dir = inst[1];
		let nx = cx, ny = cy;

		for (let j = 0; j < step; j++) {
			nx = nx + dx;
			ny = ny + dy;

			const cdx = dx;
			const cdy = dy;

			if (ny >= 50 && ny < 100 && nx < 0 && dx === -1) { // 2-3 up
				nx = ny + 100;
				ny = 0;
				// right
				dx = 0;
				dy = 1;
			} else if (nx >= 150 && nx < 200 && ny < 0 && dy === -1) { // left
				ny = nx - 100;
				nx = 0;
				// down
				dx = 1;
				dy = 0;
			} else if (nx >= 0 && nx < 50 && ny < 50 && dy === -1) { // 1-2 left
				nx = 149 - nx;
				ny = 0;
				// right
				dx = 0;
				dy = 1;
			} else if (nx >= 100 && nx < 150 && ny < 0 && dy === -1) { // left
				nx = 149 - nx;
				ny = 50;
				// right
				dx = 0;
				dy = 1;
			} else if (nx >= 50 && nx < 100 && ny < 50 && dy === -1) { // 1-8 left
				ny = nx - 50;
				nx = 100;
				// down
				dx = 1;
				dy = 0;
			} else if (ny >= 0 && ny < 50 && nx < 100 && dx === -1) { // up
				nx = ny + 50
				ny = 50;
				// right
				dx = 0;
				dy = 1;
			} else if (ny >= 100 && ny < 150 && nx < 0 && dx === -1) { // 3-4 up
				nx = 199;
				ny = ny - 100;
				// up
				dx = -1;
				dy = 0;
			} else if (ny >= 0 && ny < 50 && nx === 200 && dx === 1) { // down
				nx = 0;
				ny = ny + 100;
				// down
				dx = 1;
				dy = 0;
			} else if (ny >= 50 && ny < 100 && nx === 150 && dx === 1) { // 4-5 down
				nx = ny + 100;
				ny = 49;
				// left
				dx = 0;
				dy = -1;
			} else if (nx >= 150 && nx < 200 && ny === 50 && dy === 1) { // right
				ny = nx - 100;
				nx = 149;
				// up
				dx = -1;
				dy = 0;
			} else if (nx >= 0 && nx < 50 && ny === 150 && dy === 1) { // 4-6 right
				ny = 99;
				nx = 149 - nx;
				// left
				dx = 0;
				dy = -1;
			} else if (nx >= 100 && nx < 150 && ny === 100 && dy === 1) { // right
				ny = 149;
				nx = 149 - nx;
				// left
				dx = 0;
				dy = -1;
			} else if (ny >= 100 && ny < 150 && nx === 50 && dx === 1) { // 6-7 down
				nx = ny - 50;
				ny = 99;
				// left
				dx = 0;
				dy = -1;
			} else if (nx >= 50 && nx < 100 && ny === 100 && dy === 1) { // right
				ny = nx + 50;
				nx = 49;
				// up
				dx = -1;
				dy = 0;
			}

			if (jungle[nx][ny] === " ") {
				console.log("wrong: " + nx +", " + ny);
			}

			if (jungle[nx][ny] === ".") {
				cx = nx;
				cy = ny;
			} else {
				dx = cdx;
				dy = cdy;
				break;
			}
		}

		if (dir) {
			if (dir === "R") {
				let temp = dx;
				dx = dy;
				dy = -temp;
			} else {
				let temp = dx;
				dx = -dy;
				dy = temp;
			}
		}
	}

	const di = dirs.findIndex((dir) => {
		return dir[0] === dx && dir[1] === dy;
	});

	console.log(`${cx}, ${cy}`);
	console.log(1000 * (cx + 1) + 4 * (cy + 1) + di);
}

processLineByLine();
