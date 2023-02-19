import '../privacy_policy.txt';

import Params from './Params.mjs';
import LevelLoader from './core/LevelLoader.mjs';
import Menu from './Menu.mjs';
import GameGfx from './gfx/GameGfx.mjs';

async function start() {
    Params.configure();
    await GameGfx.configure();
    await LevelLoader.configure();
    await Menu.configure();
    
    Menu.start();
    document.body.style = "";
}

document.body.onload = start;