import Permutation from './Permutation.mjs';
import Cycle from './Cycle.mjs';
import PermutationBubble from './PermutationBubble.mjs';
import Parser from './Parser.mjs';

export default class GameItem {

    constructor(permutationIndexArray, cycles, params) {
        this.params = params;
        this.permutation = permutationIndexArray;
        this.cycles = cycles;
        this.gfxObject = PermutationBubble.cyclesToBubble(this.cycles, params);
        this.gfxObject.userData = this;
    }

    static createFromCycleNotation(text, length, params) {
        let cycles = Parser.fromCycleNotation(text);
        let permutation = Cycle.cyclesToArray(cycles, length);
        return new GameItem(permutation, cycles, params);
    }

    static createFromPermutation(permutation, params) {
        let cycles = Cycle.arrayToCycles(permutation);
        cycles = Cycle.normalizeCycles(cycles);
        return new GameItem(permutation, cycles, params);
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
        return GameItem.createFromPermutation(resultPermutation, this.params);
    }
}