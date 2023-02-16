import '../manifest.webmanifest';
import '../css/style.css';
import '../css/main-menu.css';
import '../css/modal-menu.css';

import Params from './Params.mjs';
import LevelLoader from './core/LevelLoader.mjs';
import Menu from './Menu.mjs';
import GameGfx from './gfx/GameGfx.mjs';

async function start() {
    Params.configure();
    await LevelLoader.configure();
    Menu.configure();
    await GameGfx.configure();
    
    Menu.init();
}

document.body.onload = start;