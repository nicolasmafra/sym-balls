import Game from './Game.mjs';
import Params from './Params.mjs';

const Menu = {

    stack: ['root'],

    configure() {
        Menu.configureModal();
        Menu.addButtons();
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

    addButtons() {
        document.querySelectorAll(".menu-button")
            .forEach(x => x.addEventListener("click", (e) => Menu[x.dataset.action](x, e)));
    },

    hideMenus() {
        document.querySelector('.main-menu').style.display = "none";
        document.querySelector('.modal').style.display = "none";
    },

    showMainMenu() {
        document.querySelector('.main-menu').style.display = "block";

        let current = Menu.stack[Menu.stack.length - 1];
        document.querySelectorAll('.main-menu-content').forEach(x => x.style.display = "none");
        document.querySelector('#menu-' + current).style.display = "block";
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

    open(element) {
        Menu.stack.push(element.dataset.nextMenu);
        Menu.showMainMenu();
    },

    back() {
        Menu.stack.pop();
        Menu.showMainMenu();
    },

    toggleParam(element) {
        let paramName = element.dataset.paramName
        Params.value[paramName] = !Params.value[paramName];
        console.log(`Changing param: ${paramName}=${Params.value[paramName]}`);
    },
}

export default Menu;