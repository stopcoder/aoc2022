import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';


const { find_path, single_source_shortest_paths } = dijkstra;
const { OrderedMap, PriorityQueue, LinkList, Deque } = jsSdsl;

async function processLineByLine() {
	console.time("run");
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const sensors = [];
	const beacons = [];
	const distances = [];
	const beaconMap = new Set();
	const map = {};

	const row = 2000000;

	for await (const line of rl) {
		const parts = line.split("x=");

		const sensor = parts[1].split(":")[0].split(", y=").map((c) => {
			return parseInt(c);
		}).reverse();

		sensors.push(sensor);

		const beacon = parts[2].split(", y=").map((c) => {
			return parseInt(c);
		}).reverse();

		beacons.push(beacon);

		if (beacon[0] === row) {
			beaconMap.add(beacon[1]);
		}


		const distance = Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);
		distances.push(Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]));
	}

	sensors.forEach((sensor, index) => {
		const d = distances[index];

		for (let row = sensor[0] - d; row <= sensor[0] + d; row++) {
			map[row] = map[row] || [];
			const rest = d - Math.abs(sensor[0] - row);
			map[row].push([sensor[1] - rest, sensor[1] + rest]);
		}
	});

	const min = 0;
	const max = 4000000;

	Object.keys(map).forEach((row) => {
		const iRow = parseInt(row);
		if (iRow >= min && iRow <= max) {
			const ranges = map[row];
			ranges.sort((a, b) => {
				return a[0] - b[0];
			});

			let cur = 0;

			while(cur < ranges.length) {
				const r0 = ranges[cur];
				const r1 = ranges[cur + 1];

				if (r0[1] < min) {
					ranges.splice(cur, 1);
					continue;
				}

				if (r0[0] > max) {
					ranges.splice(cur);
					break;
				}


				if (r0[0] < min) {
					r0[0] = min;
				}

				if (r0[1] > max) {
					r0[1] = max;
				}


				if (!r1) {
					break;
				}

				if (r1[0] > r0[1] + 1) {
					cur++;
				} else {
					r0[1] = Math.max(r0[1], r1[1]);
					ranges.splice(cur+1, 1);
				}
			}

			if (ranges.length > 1) {
				console.log(iRow);
				console.log(ranges)
				console.log(iRow + (ranges[0][1] + 1) * 4000000 );
			}
		}
	});

	console.timeEnd("run");
}

processLineByLine();
