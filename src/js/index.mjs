import '../css/style.css';
import '../css/main-menu.css';
import '../css/modal-menu.css';

import Params from './Params.mjs';
import Menu from './Menu.mjs';
import GameGfx from './gfx/GameGfx.mjs';

async function start() {
    Params.configure();
    Menu.configure();
    await GameGfx.configure();
    
    Menu.showMainMenu();
}

start();