let level = {}


let parsedColors = [];

function restartLevel() {
    app.stage.removeChildren();
    board.removeChildren();
    app.stage.addChild(board);

    parsedColors = level.colors.map(color => new PIXI.Color(color));

    let n = Math.ceil(Math.sqrt(
      level.items.length));
    let m = Math.ceil(level.items.length/n)
    let size = 100;
    let x0 = -size*(n-1)/2;
    let y0 = -size*(m-1)/2;
    level.items.forEach((item, i) => {
      let row = Math.floor(i / n);
      let col = i - row * n;
      let x = x0 + col * size;
      let y = y0 + row * size;
      let bubble = createBubble(item, x, y);
      bubble.x = x;
      bubble.y = y;
    });
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
        if (!merged && child != dragTarget && checkCollision(child, dragTarget)) {
            mergeBubbles(dragTarget, child);
            merged = true;
        }
    })

    dragTarget.alpha = 1;
    dragTarget = null;
}

function checkCollision(b1, b2) {
    return b1.radius
      && Math.hypot(b1.x - b2.x, b1.y - b2.y)
      < b1.radius + b2.radius;
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
