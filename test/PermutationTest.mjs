import Permutation from '../js/Permutation.mjs';

export default {

    assertArrayEquals: function(actual, expected) {
        console.assert(
            actual.length == expected.length && actual.every((e, i) => actual[i] == expected[i]),
            `${actual} is not equal ${expected}`
        );
    },

    compose: function() {
        let actual = Permutation.compose([0, 2, 1], [1, 0, 2]);
        let expected = [2, 0, 1];

        this.assertArrayEquals(actual, expected);
    },

    permuteArrayIndexes: function() {
        let original = 'abc'.split('');
        let actual = Permutation.permuteArrayIndexes([1, 2, 0], original);
        let expected = 'cab'.split('');

        this.assertArrayEquals(actual, expected);
    },

    permuteArrayIndexes2Times: function() {
        let original = 'abc'.split('');
        let actual = Permutation.permuteArrayIndexes([1, 0, 2], original);
        actual = Permutation.permuteArrayIndexes([0, 2, 1], actual);
        let expected = 'bca'.split('');

        this.assertArrayEquals(actual, expected);
    },

    permuteArrayIndexes2TimesEqualsCompose: function() {
        let original = 'abc'.split('');
        let actual = Permutation.permuteArrayIndexes([1, 0, 2], original);
        actual = Permutation.permuteArrayIndexes([0, 2, 1], actual);

        let composition = Permutation.compose([0, 2, 1], [1, 0, 2]);
        let expected = Permutation.permuteArrayIndexes(composition, original);

        this.assertArrayEquals(actual, expected);
    },
};