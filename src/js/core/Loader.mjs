import Cycle from './Cycle.mjs';
import Parser from './Parser.mjs';

const GameLoader = {

    createFromCycleNotation: function(text, length) {
        let cycles = Parser.fromCycleNotation(text);
        let permutation = Cycle.cyclesToArray(cycles, length);
        return new GameItemGfx(permutation, cycles);
    },

    createFromPermutation: function(permutation) {
        let cycles = Cycle.arrayToCycles(permutation);
        cycles = Cycle.normalizeCycles(cycles);
        return new GameItemGfx(permutation, cycles);
    },
};

export default GameLoader;