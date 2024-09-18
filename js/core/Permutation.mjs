export default {
    
    identityArray: function(length) {
        return [...Array(length).keys()];
    },
    
    isIdentityArray: function(a) {
        return a.every((y, x) => y == x);
    },

    arrayToFunction: function(a) {
        return i => a[i];
    },

    functionToArray: function(fn, length) {
        return this.identityArray(length).map(i => fn(i));
    },

    permuteArrayValues: function(valuePermutation, a) {
        return a.map(valuePermutation);
    },

    permuteArrayIndexes: function(indexPermutation, a) {
        if (Array.isArray(indexPermutation)) indexPermutation = this.arrayToFunction(indexPermutation);

        let b = Array(a.length);
        a.forEach((e, x) => b[indexPermutation(x)] = a[x]);
        return b;
    },

    compose: function(b, a) {
        if (Array.isArray(b) && Array.isArray(a)) {
            return a.map((y, x) => b[a[x]]);
        } else {
            return x => b(a(x));
        }
    },

    invertArray: function(a) {
        let b = Array(a.length);
        a.forEach((y, x) => b[y] = x);
        return b;
    },
}