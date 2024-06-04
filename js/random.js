
function generateRandomLevel(options) {
    let identity = [...Array(options.size).keys()];
    let perms = Array(options.count-1).fill(0).map(() => shuffleArray(identity.slice(0)));
    let items = perms.map(perm => ({
        perm,
        locked: false,
    }));
    shuffleArray(items);
    let result = perms.reduce((a,b) => mergePerms(a,b), identity);
    items.push({
        perm: inverseArray(result),
        locked: true,
    });

    level = {
        name: 'random',
        colors: [],
        items: items,
        targetPerm: identity,
    }
    randomizeColors();
    restartLevel();
}
function randomizeColors() {
    let n = level.targetPerm.length;
    let hueOffset = Math.random();
    let lum = 100 * (0.4 + 0.2 * Math.random()).toFixed(1);
    let sat = 100 * (0.8 + 0.2 * Math.random()).toFixed(1);
    level.colors = [];
    for (let i = 0; i < n; i++) {
        let hue = ((hueOffset + i/n) % 1).toFixed(2);
        level.colors.push(`hsl(${hue}turn, ${sat}%, ${lum}%)`);
    }
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}