import '../css/style.css';

import Gfx from './Gfx.mjs';
import GameItem from './GameItem.mjs';

Gfx.configure();

const itemList = [
    GameItem.createFromText('(1,2)'),
    GameItem.createFromText('(1,2)(3,4)(5,6)'),
    GameItem.createFromText('(1,2,3,4)(5,6)'),
];
itemList[0].gfxObject.position.setX(-0.75);
itemList[1].gfxObject.position.setX(-0.25);
itemList[2].gfxObject.position.setX(0.25);

Gfx.start();
itemList.forEach(item => Gfx.scene.add(item.gfxObject));

