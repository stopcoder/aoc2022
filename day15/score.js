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

	const sensors = [];
	const beacons = [];
	const distances = [];
	const bMap = new Set();

	let maxC = 0;
	let minC = 0;
	const row = 2000000;

	for await (const line of rl) {
		const parts = line.split("x=");

		const sensor = parts[1].split(":")[0].split(", y=").map((c) => {
			return parseInt(c);
		}).reverse();

		sensors.push(sensor);
		maxC = Math.max(maxC, sensor[1]);
		minC = Math.min(minC, sensor[1]);

		const beacon = parts[2].split(", y=").map((c) => {
			return parseInt(c);
		}).reverse();

		beacons.push(beacon);

		if (beacon[0] === row) {
			bMap.add(beacon[1]);
		}

		maxC = Math.max(maxC, beacon[1]);
		minC = Math.min(minC, beacon[1]);

		const distance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);
		distances.push(Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]));

		maxC = Math.max(maxC, sensor[1] + distance);
		minC = Math.min(minC, sensor[1] - distance);
	}

	let count = 0;


	for (let column = minC; column <= maxC; column++) {
		let match;

		if (bMap.has(column)) {
			match = false;
		} else {
			match = sensors.some((sensor, index) => {
				return (Math.abs(sensor[0] - row) + Math.abs(sensor[1] - column)) <= distances[index];
			});
		}

		if (match) {
			console.log(`(${row}, ${column})`);
			count++;
		}
	}

	console.log(maxC - minC + 1);
	console.log(count);

}

processLineByLine();
