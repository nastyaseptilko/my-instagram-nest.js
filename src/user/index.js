const orders = [2, 4, 1, 3];

const peoples = [
    { id: 1, name: 'Bob' },
    { id: 2, name: 'Joy' },
    { id: 3, name: 'Jack' },
    { id: 4, name: 'Tom' },
];

let array = [];
orders.map(o => {
    peoples.forEach(p => {
        if (p.id === o) {
            array.push(p.name);
        }
    });
});

console.log(array.join());

const result = orders.map(o => peoples.find(p => p.id === o).name).join();

// for (const order of orders) {
//     for (const people of peoples) {
//         if (people.id === order) {
//             array.push(people.name);
//         }
//     }
// }

console.log(result);

const arrayForTaskFun = [3, 5, -4, 8, 11, 1, -1, 6];
const sum = 11;
let pairsSum = [];
let arrayResult = [];

function task(array, sum) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            if (i !== j && array[i] + array[j] === sum) {
                pairsSum.push([array[i], array[j]]);
            }
        }
    }
    const sortedArray = pairsSum.map(arr => arr.sort());

    // return sortedArray.filter((x, i, sortedArray) => sortedArray.indexOf(x) === i);
    return Array.from(new Set(sortedArray.map(JSON.stringify)), JSON.parse);
}

console.log(task(arrayForTaskFun, sum));
