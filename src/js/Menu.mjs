export default {

    game: null,

    configure() {
        this.addButton(".startButton", () => this.start());
        this.addButton(".exitButton", () => this.exit());
        this.addButton(".resetButton", () => this.reset());
        this.addButton(".stopButton", () => this.stop());

        let modal = document.querySelector(".modal");
        document.querySelector(".modal-menu-toggle").onclick = () => {
            modal.style.display = "block";
        };
        document.querySelector(".modal-content-close").onclick = () => {
            modal.style.display = "none";
        };
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    },

    addButton(selector, fn) {
        document.querySelectorAll(selector).forEach(x => x.addEventListener("click", fn));
    },

    hideMenus() {
        document.querySelector('.main-menu').style.display = "none";
        document.querySelector('.modal').style.display = "none";
    },

    showMainMenu() {
        document.querySelector('.main-menu').style.display = "block";
    },

    start() {
        this.hideMenus();
        this.game.start();
    },

    stop() {
        this.hideMenus();
        this.game.stop();
        this.showMainMenu();
    },

    exit() {
        location.reload();
    },

    reset() {
        this.hideMenus();
        this.game.reset();
    },
}