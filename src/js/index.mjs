import '../css/style.css';

import Gfx from './Gfx.mjs';
import GameItem from './GameItem.mjs';

Gfx.configure();

const itemList = [
    GameItem.createFromCycleNotation('(1,2)', 6),
    GameItem.createFromCycleNotation('(1,2)(3,4)(5,6)', 6),
    GameItem.createFromCycleNotation('(1,2,3,4)(5,6)', 6),
];
itemList[0].gfxObject.position.setX(-0.75);
itemList[1].gfxObject.position.setX(-0.25);
itemList[2].gfxObject.position.setX(0.25);

itemList.forEach(item => Gfx.addObject(item.gfxObject));

Gfx.dragend = gfxObject => {
    let item = gfxObject.userData;
    let collidedItem = item.findCollidedItem(itemList);
    if (collidedItem) {
        console.log("collided with: " + collidedItem.permutation);
    }
};

Gfx.loop();
