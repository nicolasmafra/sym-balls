let level = {
    name: 'demo',
    colors: [
        0xff0000,
        0x00ff00,
        0x0000ff,
    ],
    items: [
        [ 1, 2, 0 ],
        [ 2, 0, 1 ],
        [ 1, 0, 2 ],
        [ 2, 1, 0 ],
        [ 0, 2, 1 ],
        [ 0, 2, 1 ],
    ],
    target: [ 0, 1, 2 ],
}

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

        callback();
        resetLevel();
    });
}

function resetLevel() {
    board.removeChildren();
    let n = Math.ceil(Math.sqrt(level.items.length));
    for (let i = 0; i < level.items.length; i++) {
        let item = level.items[i];
        let row = Math.floor(i / n);
        let col = i - row * n;
        let x = 200 + col * 100;
        let y = 100 + row * 100;
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
    bubble.fill(0x222222);
    let yOffset = -(item.length - 1) * ballSpace / 2;
    for (let i = 0; i < item.length; i++) {
        let color1 = level.colors[i];
        let color2 = level.colors[item[i]];
        let y = yOffset + i * ballSpace;
        let x = ballSpace/2;
        bubble.circle(-x, y, ballRadius);
        bubble.fill(color1);
        bubble.circle(+x, y, ballRadius);
        bubble.fill(color2);
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

function mergeBubbles(top, bottom) {
    let resultItem = bottom.item.map((b,a) => top.item[b]);
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
