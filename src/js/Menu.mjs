import GUI from './GUI.mjs';
import PWA from './PWA.mjs';
import GameGfx from './gfx/GameGfx.mjs';
import Params from './Params.mjs';
import LevelLoader from './core/LevelLoader.mjs';

const Menu = {

    stack: ['root'],

    async configure() {
        await GUI.configure();
        GUI.addButtons(Menu);
    },

    start() {
        Menu.showMainMenu();
    },

    hideMainMenu() {
        document.querySelector('.main-menu').classList.add("hide");
    },

    showMainMenu() {
        document.querySelector('.main-menu').classList.remove("hide");

        let current = Menu.stack[Menu.stack.length - 1];
        document.querySelectorAll('.main-menu-content').forEach(x => x.classList.add("hide"));
        document.querySelector('#menu-' + current).classList.remove("hide");
    },

    checkMobileMode() {
        if (Params.isMobile) {
            Menu.enterFullScreen();
        }
    },

    enterFullScreen() {
        GUI.enterFullScreen();
        GUI.rotateToLandscape();
    },

    startGame() {
        Menu.checkMobileMode();
        Menu.hideMainMenu();
        Menu.enterFullScreen();
        GameGfx.start();
    },

    stopGame() {
        Menu.hideMainMenu();
        GameGfx.stop();
        Menu.showMainMenu();
    },

    reset() {
        Menu.hideMainMenu();
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
        let paramValue = Params.value[element.dataset.paramName];
        let paramValueElement = element.querySelector('.menu-param-value');
        let paramText = paramValue;
        if (paramValue === true) {
            paramText = 'ON';
        }
        if (paramValue === false) {
            paramText = 'OFF';
        }
        paramValueElement.innerHTML = paramText;
    },

    toggleParam(element) {
        let paramName = element.dataset.paramName
        Params.toggleParam(paramName);
        Menu.toggleParamPrepare(element);
        let afterFunction = Menu[element.dataset.paramName + 'AfterChange'];
        if (afterFunction) {
            afterFunction(element);
        }
    },

    selectWorldPrepare(template) {
        let container = template.parentNode;
        LevelLoader.worldList.forEach(name => {
            let world = LevelLoader.worlds[name];
            let newItem = template.cloneNode();
            newItem.classList.remove('template');
            container.appendChild(newItem);

            newItem.dataset.world = name;
            newItem.innerHTML = world.title;
        });
    },

    selectWorld(element) {
        let world = element.dataset.world;
        let template = document.querySelector('#menu-select-level .template');
        let container = template.parentNode;
        container.querySelectorAll('li:not(.template)').forEach(e => container.removeChild(e));
        let levelList = LevelLoader.worlds[world].levels;
        for (let i = 0; i < levelList.length; i++) {
            const level = levelList[i];
            let newItem = template.cloneNode();
            newItem.classList.remove('template');
            container.appendChild(newItem);

            newItem.dataset.world = world;
            newItem.dataset.levelid = i;
            newItem.innerHTML = level.title;
            GUI.addButtonListener(Menu, newItem);
        }
        Menu.open(element);
    },

    loadLevel(element) {
        let levelSchema = LevelLoader.loadLevelSchema(element.dataset.world, parseInt(element.dataset.levelid));
        GameGfx.setLevelSchema(levelSchema);
        Menu.startGame();
    },

    installWebAppPrepare(element) {
        PWA.prepare(element);
    },

    installWebApp(element) {
        PWA.install(element);
    },

    resetOptions() {
        Params.resetParams();
        GUI.prepareButtons(Menu, '[data-action="toggleParam"]');
    },
}

export default Menu;