let level = {
    name: 'demo',
    colors: [
        0xff0000,
        0x00ff00,
        0x0000ff,
    ],
    items: [
        [ 1, 2, 0 ],
        [ 2, 1, 0 ],
        [ 1, 0, 2 ],
        [ 2, 1, 0 ],
        [ 0, 2, 1 ],
        [ 0, 2, 1 ],
    ]
}

const app = new PIXI.Application();
const board = new PIXI.Container();

function init(callback) {
    app.init({ resizeTo: window }).then(() => {
        document.body.appendChild(app.canvas);
        app.stage.addChild(board);
        callback();
    });
}

function resetLevel() {
    board.removeChildren();
    level.items.forEach(createItem);
}

function createItem(item) {
    let itemColors = item.map(i => level.colors[i]);
    
    let bubble = new PIXI.Graphics();
    // TODO
    board.addChild(bubble);
}
