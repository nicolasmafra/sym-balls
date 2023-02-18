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
        GUI.replaceMenuLabels();
    },

    start() {
        Menu.showMainMenu();
    },

    hideMainMenu() {
        document.querySelector('.main-menu').style.display = "none";
    },

    showMainMenu() {
        document.querySelector('.main-menu').style.display = "block";

        let current = Menu.stack[Menu.stack.length - 1];
        document.querySelectorAll('.main-menu-content').forEach(x => x.style.display = "none");
        document.querySelector('#menu-' + current).style.display = "block";
    },

    checkMobileMode() {
        if (Params.isMobile) {
            GUI.enterFullScreen();
            GUI.rotateToLandscape();
        }
    },

    startGame() {
        Menu.checkMobileMode();
        Menu.hideMainMenu();
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
        paramValueElement.dataset.label = 'param.' + paramValue;
        paramValueElement.dataset.labelFallback = paramValue;
    },

    toggleParam(element) {
        let paramName = element.dataset.paramName
        Params.toggleParam(paramName);
        Menu.toggleParamPrepare(element);
        let afterFunction = Menu[element.dataset.paramName + 'AfterChange'];
        if (afterFunction) {
            afterFunction(element);
        }
        GUI.replaceMenuLabels(element);
    },

    languageAfterChange() {
        GUI.loadLanguage(Params.value.language)
            .then(GUI.replaceMenuLabels);
    },

    loadLevelPrepare(template) {
        let container = template.parentNode;
        let levelList = LevelLoader.getLevelList();
        levelList.forEach(level => {
            let newItem = template.cloneNode();
            newItem.classList.remove('template');
            container.appendChild(newItem);

            newItem.dataset.levelid = level.id;
            newItem.dataset.label = level.title;
            GUI.replaceMenuLabel(newItem);
            GUI.addButtonListener(Menu, newItem);
        });
    },

    loadLevel(element) {
        let levelSchema = LevelLoader.loadLevelSchema(element.dataset.levelid);
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
        Menu.languageAfterChange();
    },
}

export default Menu;