import Cycle from './Cycle.mjs';
import PermutationBubble from './PermutationBubble.mjs';
import Parser from './Parser.mjs';

export default class GameItem {

    constructor(permutationIndexArray, cycles) {
        this.permutation = permutationIndexArray;
        this.cycles = cycles;
        this.gfxObject = PermutationBubble.cyclesToBubble(this.cycles);
        this.gfxObject.userData = this;
    }

    static createFromText(text) {
        let cycles = Parser.fromCycleNotation(text);
        let permutation = Cycle.cyclesToArray(cycles);
        return new GameItem(permutation, cycles);
    }

    animate() {
        PermutationBubble.animateBubble(this.gfxObject);
    }
}