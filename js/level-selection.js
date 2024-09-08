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
    app.stage.addChild(newBtn(0, 'Editor', () => showEditor()));
    data.forEach((item, index) => {
        const levelName = item.name.split('.')[0];
        const btn = newBtn(index+1, levelName, () => loadLevel(levelName));
        app.stage.addChild(btn);
    });
}

function showEditor() {
    app.stage.removeChildren();
    editor.style.setProperty('display', 'block');
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
