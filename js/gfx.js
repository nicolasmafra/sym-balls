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
        
        board.x = app.screen.width/2;
        board.y = app.screen.height/2;

        if (callback) callback();
    });
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
