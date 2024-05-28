let level = {}

const app = new PIXI.Application();
const board = new PIXI.Container();

function init(callback) {
    app.init({ resizeTo: window }).then(() => {
        document.body.appendChild(app.canvas);
        app.stage.addChild(board);

        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointermove', onDragMove);
        app.stage.on('pointerup', onDragEnd);
        app.stage.on('pointerupoutside', onDragEnd);

        if (callback) callback();
        restartLevel();
    });
}

let parsedColors = [];

function restartLevel() {
    board.removeChildren();

    parsedColors = level.colors.map(color => new PIXI.Color(color));

    let n = Math.ceil(Math.sqrt(level.items.length));
    for (let i = 0; i < level.items.length; i++) {
        let item = level.items[i];
        let row = Math.floor(i / n);
        let col = i - row * n;
        let x = 200 + col * 100;
        let y = 300 + row * 100;
        let bubble = createBubble(item, x, y);
        bubble.x = x;
        bubble.y = y;
    }
}

const ballSpace = 10;
const bubbleMargin = 10;
const ballRadius = 4;

function createBubble(item) {
    let bubble = new PIXI.Graphics();
    bubble.item = item;
    bubble.radius = item.length*ballSpace/2 + bubbleMargin;
    bubble.circle(0, 0, bubble.radius);
    bubble.fill(0xffffff, 0.2);
    let yOffset = -(item.length - 1) * ballSpace / 2;
    for (let i = 0; i < item.length; i++) {
        let color1 = parsedColors[i];
        let color2 = parsedColors[item[i]];
        let y = yOffset + i * ballSpace;
        let x = ballSpace/2;
        bubble.circle(-x, y, ballRadius);
        bubble.fill(color1, 1);
        bubble.circle(+x, y, ballRadius);
        bubble.fill(color2, 1);
    }
    bubble.eventMode = 'static';
    bubble.on('pointerdown', onDragStart, bubble);
    bubble.cursor = 'pointer';
    board.addChild(bubble);
    return bubble;
}

let dragTarget = null;
function onDragStart() {
    dragTarget = this;
    this.alpha = 0.7;
    this.parent.addChild(this);
}
function onDragMove(event) {
    if (dragTarget) dragTarget.parent.toLocal(event.global, null, dragTarget.position);
}
function onDragEnd(event) {
    if (!dragTarget) return;

    let merged = false;
    board.children.forEach(child => {
        if (!merged && child != dragTarget && checkCollision(child, event.data.global.x, event.data.global.y)) {
            mergeBubbles(dragTarget, child);
            merged = true;
        }
    })

    dragTarget.alpha = 1;
    dragTarget = null;
}

function checkCollision(bubble, x, y) {
    return bubble.radius && Math.hypot(bubble.x - x, bubble.y - y) < bubble.radius + dragTarget.radius;
}

function mergeArrays(first, second) {
    return first.map(b => second[b]);
}

function mergeBubbles(top, bottom) {
    let resultItem = mergeArrays(bottom.item, top.item);
    console.log('merging:');
    for (let i = 0; i<resultItem.length; i++) {
        console.log(`${i}->${bottom.item[i]}->${top.item[bottom.item[i]]} = ${i}->${resultItem[i]}`);
    }
    let newBubble = createBubble(resultItem);
    newBubble.position.copyFrom(bottom.position)
    board.removeChild(top, bottom);

    checkWinning();
}

function checkWinning() {
    if (board.children.length != 1) return;

    let last = board.children[0];
    let equalsTarget = last.item.every((value, index) => value === level.target[index]);
    setTimeout(() => {
        if (equalsTarget) {
            alert('You won!');
        } else {
            alert('You lost!');
        }
    }, 100);
}

function generateRandomLevel(options) {
    let identity = [...Array(options.size).keys()];
    let hueOffset = Math.random();
    let hueDirection = Math.random() < 0.5 ? -1 : 1;
    let items = Array(options.count-1).fill(0).map(() => shuffleArray(identity.slice(0)));
    let result = items.reduce((a,b) => mergeArrays(a,b), identity);
    items.push(inverseArray(result));
    shuffleArray(items);

    level = {
        name: 'random',
        colors: identity.map(i => color(i, hueOffset, hueDirection)),
        items,
        target: identity,
    }
    restartLevel();
}
function distribute(n, base=2) {
    let binary = n.toString(base)
    let reverse = binary.split('').reverse().join('');
    return parseInt(reverse, base)/Math.pow(base, binary.length)
}
function color(n, offset=0, dir=1, base=2) {
    let hue = (offset + dir*distribute(n, base)) % 1;
    return `hsl(${hue}turn, 70%, 50%)`
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function inverseArray(array) {
    let result = Array(array.length);
    for (let i = 0; i < array.length; i++) {
        const j = array[i];
        result[j] = i;
    }
    return result;
}
