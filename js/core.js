let level = {}

const app = new PIXI.Application();
const board = new PIXI.Container();

function init(callback) {
    app.init({ resizeTo: window }).then(() => {
        document.body.appendChild(app.canvas);

        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointermove', onDragMove);
        app.stage.on('pointerup', onDragEnd);
        app.stage.on('pointerupoutside', onDragEnd);

        if (callback) callback();
    });
}

let parsedColors = [];

function restartLevel() {
    app.stage.removeChildren();

    const restartBtn = newIconBtn(0, '\uf01e', () => restartLevel());
    app.stage.addChild(restartBtn);

    board.removeChildren();
    app.stage.addChild(board);

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
    let perm = item.perm;
    let bubble = new PIXI.Graphics();
    bubble.item = item;
    bubble.radius = perm.length*ballSpace/2 + bubbleMargin;
    bubble.circle(0, 0, bubble.radius);
    if (item.locked) {
        bubble.fill(0x605040, 1);
    } else {
        bubble.fill(0xffffff, 0.2);
    }
    let yOffset = -(perm.length - 1) * ballSpace / 2;
    for (let i = 0; i < perm.length; i++) {
        let color1 = parsedColors[i];
        let color2 = parsedColors[perm[i]];
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
    if (this.item.locked) return;

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

function mergePerms(first, second) {
    return first.map(b => second[b]);
}

function mergeBubbles(top, bottom) {
    let perm = mergePerms(bottom.item.perm, top.item.perm);
    let newBubble = createBubble({
        ...bottom.item,
        perm,
    });
    newBubble.position.copyFrom(bottom.position)
    board.removeChild(top, bottom);

    checkWinning();
}

function checkWinning() {
    if (board.children.length != 1) return;

    let last = board.children[0];
    let equalsTarget = last.item.perm.every((value, index) => value === level.targetPerm[index]);
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
function inverseArray(array) {
    let result = Array(array.length);
    for (let i = 0; i < array.length; i++) {
        const j = array[i];
        result[j] = i;
    }
    return result;
}

function newBtn(i, text, fn) {
    const width = 400;
    const height = 40;
    const spacing = 10;
    let btn = new PIXI.Graphics();
    btn.roundRect(-width/2, -height/2, width, height, 5);
    btn.fill(0x888888);
    let btnText = new PIXI.Text({
        text,
        style: {
            align: 'center',
        }
    })
    btnText.anchor.x = 0.5;
    btnText.anchor.y = 0.5;
    btn.addChild(btnText);
    btn.eventMode = 'static';
    btn.on('pointerdown', fn);
    btn.cursor = 'pointer';
    btn.x = app.renderer.width / 2;
    btn.y = (spacing + height) * (0.5 + i);
    return btn;
}

function newIconBtn(i, text, fn) {
    const width = 40;
    const height = 40;
    const spacing = 10;
    let btn = new PIXI.Graphics();
    btn.roundRect(-width/2, -height/2, width, height, 5);
    btn.fill(0x888888);
    let btnText = new PIXI.Text(text, {
        fontFamily: 'fontawesome',
        fill: 0xffffff,
    })
    btnText.anchor.x = 0.5;
    btnText.anchor.y = 0.5;
    btn.addChild(btnText);
    btn.eventMode = 'static';
    btn.on('pointerdown', fn);
    btn.cursor = 'pointer';
    btn.x = spacing + width/2;
    btn.y = (spacing + height) * (0.5 + i);
    return btn;
}
