import GameLoader from "./GameLoader.mjs";
import Permutation from "./Permutation.mjs";

function arrayEquals(array1, array2) {
    return array1.length === array2.length
        && array1.every((value, index) => (value === array2[index]));
}

function findItemDockSolution(itemToSolve, generatingSet) {
    console.log('Finding solution for item', itemToSolve);
    let history = [ {
        moves: [],
        state: itemToSolve
    } ];
    let maxMovesOptions = [ ...history ];
    let moveCount = 0;
    while (history.length < 100) {
        moveCount++;
        let newOptions = maxMovesOptions.flatMap(option => generatingSet.map(item => {
            return {
                moves: [ ...option.moves, item ],
                state: Permutation.compose(item, option.state)
            };
        }));

        let solved = newOptions.find(option => Permutation.isIdentityArray(option.state));
        if (solved) {
            console.log('solution: ', solved.moves);
            return solved.moves;
        }

        maxMovesOptions = newOptions.filter(option => !history.find(h => arrayEquals(h.state, option.state)));
    }
    console.log('Not found. Max move count:', moveCount);
}

async function run() {
    let worldName = process.argv[2];
    let levelIndex = parseInt(process.argv[3]);
    const { default: world } = await import(`../../assets/levels/${worldName}.json`, {
        assert: {
            type: "json",
        },
    });
    let levelSchema = world.levels[levelIndex];
    let parsedSchema = GameLoader.parseSchema(levelSchema);
    let targetMoves = parsedSchema.initialItems.map(item => {
        let solution = findItemDockSolution(item, parsedSchema.generatingSet);
        return solution.length;
    }).reduce((partialSum, a) => partialSum + a, 0);
    console.log('targetMoves:', targetMoves);
}

run();
