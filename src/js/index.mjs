import '../css/style.css';
import '../css/main-menu.css';
import '../css/modal-menu.css';

import Params from './Params.mjs';
import Gfx from './Gfx.mjs';
import Menu from './Menu.mjs';

Params.configure();
Menu.configure();
Gfx.configure();

Menu.showMainMenu();