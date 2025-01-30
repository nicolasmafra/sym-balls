import Game from './Game.mjs';
import Parser from './Parser.mjs';
import Cycle from './Cycle.mjs';

const GameLoader = {

    loadGameFromLevelSchema(levelSchema) {
        let parse = this.createCycleNotationParser(levelSchema.length);
        let hasDock = this.isFilledArray(levelSchema.generatingSet);
        let gameSchema = {
            id: levelSchema.id,
            initialItems: parse(levelSchema.initialItems),
            generatingSet: parse(levelSchema.generatingSet),
            lockInitialItems: hasDock,
            allowedDeletion: false,
            allowedDuplication: false,
            allowedInversion: false,
            finiteDock: levelSchema.finiteDock || false,
        };
        return new Game(gameSchema);
    },

    isFilledArray(array) {
        return Array.isArray(array) && array.length > 0;
    },

    createCycleNotationParser(length) {
        return array => {
            if (!array) {
                return [];
            }
            return array
                .map(text => Parser.fromCycleNotation(text))
                .map(cycles => Cycle.cyclesToArray(cycles, length));
        };
    },
};

export default GameLoader;