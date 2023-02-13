import GameGfx from './gfx/GameGfx.mjs';
import Params from './Params.mjs';
import LevelLoader from './core/LevelLoader.mjs';

const Menu = {

    stack: ['root'],

    configure() {
        Menu.configureModals();
        Menu.addButtons();
    },

    configureModals() {
        let modalMenu = document.querySelector(".modal-menu");
        document.querySelector(".modal-menu-toggle").onclick = () => {
            modalMenu.style.display = "block";
        };
        document.querySelectorAll(".modal").forEach(modal => {
            modal.querySelector(".modal-content-close").onclick = () => {
                modal.style.display = "none";
            };
            modal.addEventListener("click", () => {modal.style.display = "none"});
        });
    },

    addButtons() {
        document.querySelectorAll(".menu-button")
            .forEach(button => {
                if (Menu[button.dataset.action + 'Prepare']) {
                    Menu[button.dataset.action + 'Prepare'](button);
                }
                Menu.addButtonListener(button);
            });
    },

    addButtonListener(button) {
        if (Menu[button.dataset.action]) {
            button.addEventListener("click", (e) => Menu[button.dataset.action](button, e))
        }
    },

    hideMenus() {
        document.querySelector('.main-menu').style.display = "none";
        document.querySelector('.modal-menu').style.display = "none";
    },

    showMainMenu() {
        document.querySelector('.main-menu').style.display = "block";

        let current = Menu.stack[Menu.stack.length - 1];
        document.querySelectorAll('.main-menu-content').forEach(x => x.style.display = "none");
        document.querySelector('#menu-' + current).style.display = "block";
    },

    start() {
        Menu.enterFullScreen();
        Menu.rotateToLandscape();
        Menu.hideMenus();
        GameGfx.start();
    },

    stop() {
        Menu.hideMenus();
        GameGfx.stop();
        Menu.showMainMenu();
    },

    exit() {
        location.reload();
    },

    reset() {
        Menu.hideMenus();
        GameGfx.reset();
    },

    open(element) {
        Menu.stack.push(element.dataset.nextMenu);
        Menu.showMainMenu();
    },

    back() {
        Menu.stack.pop();
        Menu.showMainMenu();
    },

    toggleParamPrepare(element) {
        let paramName = element.dataset.paramName;
        let label = Params.value[paramName];
        if (label === true) label = 'ON';
        if (label === false) label = 'OFF';
        element.querySelector('.menu-param-value').innerHTML = label;
    },

    toggleParam(element) {
        let paramName = element.dataset.paramName
        Params.toggleParam(paramName);
        Menu.toggleParamPrepare(element);
    },

    enterFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    },

    rotateToLandscape() {
        let orientation = screen.orientation.type;
        if (!orientation.startsWith("landscape")) {
            screen.orientation.lock("landscape");
        }
    },

    loadLevelPrepare(template) {
        let container = template.parentNode;
        let levelList = LevelLoader.getLevelList();
        levelList.forEach(level => {
            let newItem = template.cloneNode();
            newItem.classList.remove('template');
            container.appendChild(newItem);

            newItem.innerHTML = level.title;
            newItem.dataset.levelid = level.id;
            Menu.addButtonListener(newItem);
        });
    },

    loadLevel(element) {
        let levelSchema = LevelLoader.loadLevelSchema(element.dataset.levelid);
        GameGfx.setLevelSchema(levelSchema);
        Menu.start();
    }
}

export default Menu;