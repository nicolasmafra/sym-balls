import '../css/style.css';

import Gfx from './Gfx.mjs';
import Game from './Game.mjs';
import Menu from './Menu.mjs';

Menu.create();

Gfx.configure();

Gfx.loop();
Game.start(Gfx);
