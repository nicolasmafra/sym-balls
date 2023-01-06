import '../css/style.css';

import Gfx from './Gfx.mjs';
import Game from './Game.mjs';

Gfx.configure();
Gfx.loop();

Game.start(Gfx);
