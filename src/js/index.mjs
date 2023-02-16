import '../manifest.webmanifest';
import '../assets/ico168.png';
import '../css/style.css';
import '../css/main-menu.css';
import '../css/modal-menu.css';
import '@fortawesome/fontawesome-free/js/fontawesome.js'
import '@fortawesome/fontawesome-free/js/solid.js'
import '@fortawesome/fontawesome-free/js/regular.js'
import '@fortawesome/fontawesome-free/js/brands.js'
import '../sw.js';

import Params from './Params.mjs';
import LevelLoader from './core/LevelLoader.mjs';
import Menu from './Menu.mjs';
import GameGfx from './gfx/GameGfx.mjs';

async function start() {
    Params.configure();
    await GameGfx.configure();
    await LevelLoader.configure();
    Menu.configure();
    
    Menu.init();
}

document.body.onload = start;