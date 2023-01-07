import fs from 'fs';
import readline from 'readline';
import jsSdsl from 'js-sdsl';
import dijkstra from 'dijkstrajs';
import hash from 'object-hash';


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

	const bps = [];

	for await (const line of rl) {
		const m = line.split(": ")[1];
		const parts = m.split(". ");
		const bp = [];
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const as = part.split("costs ")[1].split(" and ");
			if (as.length === 1) {
				bp.push([parseInt(as[0].split(" ")[0]), 0]);
			} else {
				bp.push(as.map((p) => {
					return parseInt(p.split(" ")[0]);
				}));
			}
		}
		bps.push(bp);
	}

	const result = bps.slice(0, 3).reduce((acc, recipe, i) => {
		const limit = [Math.max(...recipe.map(a => a[0])), recipe[2][1], recipe[3][1]];
		//console.log("limit: " + limit);

		const map = new Map();

		// ore, clay, obsidian, geode
		const optimise = (robots, material, time) => {
			if (time === 0) {
				return material[3];
			}

			material = material.map((m, i) => {
				if (i === 3) {
					return m;
				} else {
					return Math.min(m, limit[i] * time);
				}
			});

			// console.log(robots + ", " + material + ", time left: " + time);

			const key = robots.concat(material, time).join(",");
			if (map.has(key)) {
				// console.log("hit key: " + key);
				return map.get(key);
			}

			// do nothing
			let maxGeode = material[3] + robots[3] * time;

			for (let i = 0; i < recipe.length; i++) {
				// if we have enough robots to cover the maximum usage of the material kind, do NOT build new
				// robot
				if (i < 3 && robots[i] >= limit[i]) {
					continue;
				}

				let wait = Math.max(Math.ceil((recipe[i][0] - material[0]) / robots[0]), 0);
				if (i >= 2) {
					if (robots[i - 1] === 0) {
						continue;
					}
					wait = Math.max(Math.ceil((recipe[i][1] - material[i - 1]) / robots[i - 1]), wait);
				}

				let remtime = time - wait - 1;
				if (remtime <= 0) {
					continue;
				}

				const newRobots = robots.slice();
				newRobots[i]++;

				const newMaterial = material.map((m, i) => {
					return m + robots[i] * (wait + 1);
				});

				newMaterial[0] -= recipe[i][0];
				if (i >= 2) {
					newMaterial[i - 1] -= recipe[i][1];
				}

				maxGeode = Math.max(maxGeode, optimise(newRobots, newMaterial, remtime));
			}

			map.set(key, maxGeode);
			return maxGeode;
		};

		console.log(recipe);

		const result = optimise([1, 0, 0, 0], [0, 0, 0, 0], 32);

		return acc * result;
	}, 1);

	console.log(result);
}

processLineByLine();
