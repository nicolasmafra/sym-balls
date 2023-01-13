import Permutation from './Permutation.mjs';
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

    static createFromCycleNotation(text, length) {
        let cycles = Parser.fromCycleNotation(text);
        let permutation = Cycle.cyclesToArray(cycles, length);
        return new GameItem(permutation, cycles);
    }

    static createFromPermutation(permutation) {
        let cycles = Cycle.arrayToCycles(permutation);
        cycles = Cycle.normalizeCycles(cycles);
        return new GameItem(permutation, cycles);
    }

    animate() {
        PermutationBubble.animateBubble(this.gfxObject);
    }

    findCollidedItem(items) {
        return items
                .filter(item => item != this)
                .find(item => {
                    let minDist = this.gfxObject.scale.x + item.gfxObject.scale.x;
                    return this.gfxObject.position.distanceToSquared(item.gfxObject.position) < minDist*minDist;
        });
    }

    mergeWith(item) {
        let resultPermutation = Permutation.compose(this.permutation, item.permutation);
        return GameItem.createFromPermutation(resultPermutation);
    }
}