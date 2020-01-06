function flatten(arr, level) {
    console.log(level);

    if (level === 0) {
        return arr;
    }

    let step = 1, nextIndex = 0, hasArray = true;
    if (level == null) {
        level = 1;
    }
    if (level === Infinity) {
        step = 0;
    }
    let result = arr;

    while (level > 0 && hasArray === true) {
        hasArray = false;
        let tempResult = result.slice(0, nextIndex);

        for (let i = nextIndex; i < result.length; i++) {
            if (Array.isArray(result[i])) {
                tempResult=tempResult.concat(result[i]);
                result[i].forEach((item, index) => {
                    if (Array.isArray(item)) {
                        nextIndex = i + index;
                        hasArray = true;
                    }
                });
            } else {
                tempResult.push(result[i]);
            }
        }
        level -= step;
        result = tempResult;
        console.log('run');

    }


    console.log(result);
    return result;


}
Promise

// flatten([1, 2, 3, 4, 5],)
// console.log('-----------');
//
// // flatten([1, 2, 3, 4, 5], 1)
// console.log('-----------');
// flatten([1, 2, 3, [41, 42], 5], 1)
// console.log('-----------');
// flatten([1, 2, 3, [41, 42], , 5])
// console.log('-----------');
// flatten([1, 2, 3, [41, 42], [51, 52]])
// console.log('-----------');
// flatten([[11, 12], 2, 3, [41, 42], [51, 52]], 1)
// console.log('-----------');
// flatten([[11, 12], 2, 3, [41, 42], [51, 52]], 3)
// console.log('-----------');
// flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532]]])
console.log('-----------');
flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532]]], 1)
// console.log('-----------');
flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532]]], 3)
// console.log('-----------');
// flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532, [5331, 5332]]]], 2)
// console.log('-----------');
// flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532, [5331, 5332]]]], 3)
// console.log('-----------');
// flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532, [5331, 5332]]]])
// console.log('-----------');
flatten([[11, 12], 2, 3, [41, 42], [51, 52, [531, 532, [5331, 5332, [53331, 53332]]]]], Infinity)
