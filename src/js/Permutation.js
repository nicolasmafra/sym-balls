module.exports = {
    
    identity: function(length) {
        return [...Array(length).keys()];
    },
    
    isIdentity: function(a) {
        return a.every((x, i) => x == i);
    },

    compose: function(a, b) {
        return b.map(x => a[x]);
    },

    inverse: function(a) {
        let b = Array(a.length);
        a.forEach((x, i) => b[x] = i);
        return b;
    },

    cyclesToArray: function(length, cycles) {
        let array = this.identity(length);
        cycles.forEach(cycle => {
            cycle.forEach((x, i) => {
                let nextIndex = (i + 1) % cycle.length;
                array[x] = cycle[nextIndex];
            })
        })
    },

    arrayToCycles: function(a, includeOneCycles) {
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

        return this.normalizeCycles(cycles, includeOneCycles);
    },

    normalizeCycles: function(cycles, includeOneCycles) {
        return cycles
                .filter(cycle => cycle.length > 1 || includeOneCycles)
                .map(cycle => this.rotateArrayToFirst(cycle, Math.max(...cycle)))
                .sort((a, b) => a[0] - b[0]);
    },

    rotateArrayToFirst: function(arr, val) {
        return arr.concat(arr.splice(0, arr.indexOf(val)));
    }
}