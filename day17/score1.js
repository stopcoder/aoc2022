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

	const shapes = [
		[
			['#', '#', '#', '#']
		],
		[
			['.', '#', '.'],
			['#', '#', '#'],
			['.', '#', '.']
		],
		[
			['.', '.', '#'],
			['.', '.', '#'],
			['#', '#', '#'],
		],
		[
			['#'],
			['#'],
			['#'],
			['#']
		],
		[
			['#', '#'],
			['#', '#']
		]
	];

	let moves;
	for await (const line of rl) {
		moves = line.split("");
	}

	let container = [];

	let moveIndex = 0;
	let shapeIndex = 0;

	const checkMove = (shape, bottom, left) => {
		if (bottom < 0) {
			return false;
		}

		const shapeWidth = shape[0].length;
		const shapeHeight = shape.length;

		const top = bottom + shapeHeight - 1;
		let res = true;

		for (let i = 0; i < shapeHeight; i++) {
			for (let j = 0; j < shapeWidth; j++) {
				const cr = top - i;
				const cc = left + j;

				if (!container[cr] || container[cr][cc] !== "#") {
					continue;
				}

				if (shape[i][j] === "#") {
					res = false;
					break;
				}
			}
		}

		return res;
	};

	const write = (shape, bottom, left) => {
		const shapeWidth = shape[0].length;
		const shapeHeight = shape.length;

		const top = bottom + shapeHeight - 1;

		for (let i = 0; i < shapeHeight; i++) {
			for (let j = 0; j < shapeWidth; j++) {
				const cr = top - i;
				const cc = left + j;

				if (!container[cr]) {
					container[cr] = Array(7).fill(".");
				}

				if (shape[i][j] === "#") {
					container[cr][cc] = shape[i][j];
				}
			}
		}
	};

	const findBlock = (w) => {
		let bitmask, i; 
		for (i = container.length - 1; i >= 0; i--) {
			let sum = 0;
			for (let j = 0; j < container[i].length; j++) {
				if (container[i][j] === ".") {
					sum += (1 << j)
				}
			}
			if (bitmask === undefined) {
				bitmask = sum;
			} else {
				bitmask = bitmask & sum;
			}

			if (bitmask === 0) {
				break;
			}
		}

		return i;
	};

	const signature = (count) => {
		const res = [];
		for (let i = 0; i < count; i++) {
			const index = container.length - 1 - i;

			if (index < 0) {
				break;
			}

			let sum = 0;
			for (let j = 0; j < container[index].length; j++) {
				if (container[index][j] === ".") {
					sum += (1 << j)
				}
			}

			res.push(sum);
		}

		return res;
	};

	let shapeCount = 0;

	const seen = new Set();
	const posMap = new Map();
	const T = 1000000000000;
	const heights = [];

	while (true) {
		const shape = shapes[shapeIndex];
		const shapeWidth = shape[0].length;

		if (shapeCount % 1000000 === 0) {
			console.log(shapeCount);
		}

		const h = hash([
			shapeIndex,
			moveIndex,
			signature(40)
		]);


		if (seen.has(h)) {
			const oldCount = posMap.get(h);
			console.log(`repeated from ${oldCount} to ${shapeCount}`);
			const repeatLength = shapeCount - oldCount;
			const height = heights[shapeCount - 1] - heights[oldCount - 1];
			const repeatTimes = Math.floor((T - 1 - oldCount) / repeatLength);
			const left = ((T - 1) - oldCount) % repeatLength;

			console.log(height * repeatTimes + heights[oldCount] + heights[oldCount + left] - heights[oldCount]);
			break;
		} else {
			seen.add(h);
			posMap.set(h, shapeCount);
		}


		let bottom = container.length + 3;
		let left = 2;

		while(true) {
			// blow
			let newLeft;
			if (moves[moveIndex] === "<") {
				newLeft = Math.max(0, left - 1);
			} else {
				newLeft = Math.min(7 - shapeWidth, left + 1);
			}

			if (newLeft === left || checkMove(shape, bottom, newLeft)) {
				left = newLeft;
			}
			moveIndex = (moveIndex + 1) % moves.length;

			// check whether a move is possible
			const canMove = checkMove(shape, bottom - 1, left);

			if (canMove) {
				// move
				bottom--;
			} else {
				// write to container
				write(shape, bottom, left);
				break;
			}
		}

		shapeIndex = (shapeIndex + 1) % shapes.length;
		heights.push(container.length);
		shapeCount++;

		if (shapeCount === /*2022*/1000000000000) {
			console.log(container.length + deleteCount);
			break;
		}
	};
}

processLineByLine();
