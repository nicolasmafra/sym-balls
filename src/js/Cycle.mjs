export default {

    cyclesToArray: function(length, cycles) {
        let array = [...Array(length).keys()];
        cycles.forEach(cycle => {
            cycle.forEach((x, i) => {
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
                .map(this.normalizeCycle)
                .sort((a, b) => a[0] - b[0]);
    },

    normalizeCycle: function(cycle) {
        return this.rotateArrayToFirst(cycle, Math.max(...cycle));
    },

    rotateArrayToFirst: function(arr, val) {
        return arr.concat(arr.splice(0, arr.indexOf(val)));
    },
}