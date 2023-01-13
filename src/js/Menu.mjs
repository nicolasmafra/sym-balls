import Game from './Game.mjs';

const Menu = {

    configure() {
        Menu.configureModal();

        Menu.addButton(".startButton", Menu.start);
        Menu.addButton(".exitButton", Menu.exit);
        Menu.addButton(".resetButton", Menu.reset);
        Menu.addButton(".stopButton", Menu.stop);
    },

    configureModal() {
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
        Menu.hideMenus();
        Game.start();
    },

    stop() {
        Menu.hideMenus();
        Game.stop();
        Menu.showMainMenu();
    },

    exit() {
        location.reload();
    },

    reset() {
        Menu.hideMenus();
        Game.reset();
    },
}

export default Menu;