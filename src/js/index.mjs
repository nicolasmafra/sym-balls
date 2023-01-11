import '../css/style.css';
import '../css/main-menu.css';
import '../css/modal-menu.css';

import Params from './Params.mjs';
import Gfx from './Gfx.mjs';
import Game from './Game.mjs';
import Menu from './Menu.mjs';

Params.calculateDefaultValue();

Gfx.params = Params.value;
Game.params = Params.value;

Menu.game = Game;
Menu.configure();

Gfx.configure();

Game.gfx = Gfx;
