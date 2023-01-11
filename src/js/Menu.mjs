export default {

    game: null,

    configure() {
        this.addButton(".startButton", () => this.start());
        this.addButton(".exitButton", () => this.exit());
        this.addButton(".resetButton", () => this.reset());
        this.addButton(".stopButton", () => this.stop());
    },

    addButton(selector, fn) {
        document.querySelectorAll(selector).forEach(x => x.addEventListener("click", fn));
    },

    hideMenus() {
        document.querySelector('.main-menu').style.display = "none";
    },

    showMainMenu() {
        document.querySelector('.main-menu').style.display = "block";
    },

    start() {
        this.hideMenus();
        this.game.start();
    },

    stop() {
        this.game.stop();
        this.showMainMenu();
    },

    exit() {
        location.reload();
    },

    reset() {
        this.game.reset();
    },
}