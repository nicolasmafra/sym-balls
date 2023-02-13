import Game from './Game.mjs';
import Parser from './Parser.mjs';
import Cycle from './Cycle.mjs';

const defaultLevel = {
    length: 6,
    initialItems: [
        '(1,2)(3,4)(5,6)',
        '(1,3)',
        '(1,2,3,4)(5,6)',
    ]
}

const GameLoader = {

    loadGameFromObject(obj) {
        let parse = this.createCycleNotationParser(obj.length);
        let hasDock = this.isFilledArray(obj.generatingSet);
        let schema = {
            initialItems: parse(obj.initialItems),
            generatingSet: parse(obj.generatingSet),
            lockInitialItems: hasDock,
            allowedDeletion: false,
            allowedDuplication: false,
            allowedInversion: false,
        };
        return new Game(schema);
    },

    loadDefaultLevel() {
        return this.loadGameFromObject(defaultLevel);
    },

    isFilledArray(array) {
        return Array.isArray(array) && array.length > 0;
    },

    parseCycleNotation(text, length) {
        let cycles = Parser.fromCycleNotation(text);
        return Cycle.cyclesToArray(cycles, length);
    },
    createCycleNotationParser(length) {
        return array => {
            if (!array) {
                return [];
            }
            return array.map(text => this.parseCycleNotation(text, length));
        };
    },
};

export default GameLoader;