const array = [
	[11, 2, 3, 9, 5, 7, 1],
	[4, 23, 12, 72, 5, 9, 1],
	[9, 4, 22, 1, 5, 90, 44]
];

function intersection(arrayOfArrays) {
	const ret = [];
	const maxLength = arrayOfArrays[0].length;
	const array = arrayOfArrays.reduce((acc, val) => {
		acc.push(...val);
		return acc;
	}, []);

	for (let k = 0; k < array.length; k++) {
		let count = 0;
		for (let j = k; j < array.length; j++) {
			let curr = array[j];
			if (j + 1 < array.length - 1) {
				let val = array.indexOf(curr, j + 1);
				if (val > -1) {
					j = val;
					count++;
				}

				if (count === maxLength) {
					ret.push(curr);
					continue;
				}
			}
		}
	}

	return ret;
}

function intersection2(arrayOfArrays) {
	let maxLength = arrayOfArrays[0].length;
	let ret = [];
	let map = arrayOfArrays.reduce((acc, val, index, array) => {
		for (let k = 0; k < val.length; k++) {
			let curr = val[k];
			acc[val[k]] ? acc[val[k]]++ : acc[val[k]] = 0;
		}
		return acc;
	}, {});

	console.log('map', map);

	for (let [k, v] of Object.entries(map))
		if (v === maxLength)
			ret.push(k);
	return ret;
}

//console.log('val', intersection(array));
console.log('val', intersection2(array));