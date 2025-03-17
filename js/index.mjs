import Params from './Params.mjs';
import LevelLoader from './core/LevelLoader.mjs';
import Menu from './Menu.mjs';
import GameGfx from './gfx/GameGfx.mjs';

async function start() {
    try {
        Params.configure();
        await GameGfx.configure();
        await LevelLoader.configure();
        await Menu.configure();
        
        Menu.start();
    } catch (e) {
        console.error(e);
        window.alert(`Error: ${e}`);
    }
}

document.body.onload = start;