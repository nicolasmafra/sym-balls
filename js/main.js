const urlParams = new URLSearchParams(window.location.search);
const app = new PIXI.Application();

function init() {
    app.init({ resizeTo: window }).then(() => {
        document.body.appendChild(app.canvas);
        initGfx(app);
        initEvents(app);
        const levelParam = urlParams.get('level');
        if (levelParam) {
            loadLevel(levelParam);
            return;
        }
        listLevels();
    });
}
