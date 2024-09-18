export default {

    cyclesToArray: function(cycles, length) {
        if (!length) length = cycles.map(cycle => cycle.length).reduce((acc, x) => acc + x, 0);

        let array = [...Array(length).keys()];
        cycles.forEach(cycle => {
            cycle.forEach((x, i) => {
                if (x > length) {
                    throw new Error("invalid permutation length for cycles!");
                }
                let nextIndex = (i + 1) % cycle.length;
                array[x] = cycle[nextIndex];
            })
        });
        return array;
    },

    arrayToCycles: function(a) {
        let usedIndexes = [];
        let cycles = [];
        a.forEach((x, i) => {

            if (!usedIndexes.includes(i)) {

                let cycle = [];
                let currentIndex = i;
                do {
                    usedIndexes.push(currentIndex);
                    cycle.push(currentIndex);
                    currentIndex = a[currentIndex];
                } while (currentIndex != i);

                cycles.push(cycle);
            }
        });

        return cycles;
    },

    normalizeCycles: function(cycles, includeOneCycles) {
        return cycles
                .filter(cycle => cycle.length > 1 || includeOneCycles)
                .map(cycle => this.normalizeCycle(cycle))
                .sort((a, b) => a[0] - b[0]);
    },

    normalizeCycle: function(cycle) {
        return this.rotateArrayToFirst(cycle, Math.max(...cycle));
    },

    rotateArrayToFirst: function(arr, val) {
        return arr.concat(arr.splice(0, arr.indexOf(val)));
    },
}