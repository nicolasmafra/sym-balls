async function listLevels() {
    app.stage.removeChildren();
    app.stage.addChild(new PIXI.Text({
        text: 'Listing levels...',
        align: 'center',
        style: {
            fill: 0xffffff,
        }
    }));

    const response = await fetch('https://api.github.com/repos/nicolasmafra/sym-balls/contents/levels');
    const data = await response.json();

    app.stage.removeChildren();
    data.forEach((item, index) => {
        const levelName = item.name.split('.')[0];
        const btn = newBtn(index, levelName, () => loadLevel(levelName));
        app.stage.addChild(btn);
    });
}

async function loadLevel(levelName) {
    app.stage.removeChildren();
    app.stage.addChild(new PIXI.Text({
        text: 'Loading level...',
        align: 'center',
        style: {
            fill: 0xffffff,
        }
    }));
    const response = await fetch(`./levels/${levelName}.json`);
    level = await response.json();
    restartLevel();
}
