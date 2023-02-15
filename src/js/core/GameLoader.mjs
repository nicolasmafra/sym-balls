import Game from './Game.mjs';
import Parser from './Parser.mjs';
import Cycle from './Cycle.mjs';

const GameLoader = {

    loadGameFromLevelSchema(levelSchema) {
        let parse = this.createCycleNotationParser(levelSchema.length);
        let hasDock = this.isFilledArray(levelSchema.generatingSet);
        let gameSchema = {
            initialItems: parse(levelSchema.initialItems),
            generatingSet: parse(levelSchema.generatingSet),
            lockInitialItems: hasDock,
            allowedDeletion: false,
            allowedDuplication: false,
            allowedInversion: false,
        };
        return new Game(gameSchema);
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