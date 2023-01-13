import Gfx from './Gfx.mjs';
import GameItem from './GameItem.mjs';

const levelLength = 6;
const levelInitialItems = [
    '(1,2)(3,4)(5,6)',
    '(1,3)',
    '(1,2,3,4)(5,6)',
];

const Game = {

    start() {
        Gfx.dragend = (gfxObject) => Game.ondragend(gfxObject);

        Gfx.start();

        Game.addInitialItems();
    },

    stop() {
        Gfx.stop();
    },

    reset() {
        Gfx.objects.forEach(gfxObject => Gfx.removeObject(gfxObject));

        Game.addInitialItems();
    },

    addInitialItems() {
        let initialItemList = levelInitialItems.map(text => {
            return GameItem.createFromCycleNotation(text, levelLength);
        });

        initialItemList[0].gfxObject.position.setX(-0.75);
        initialItemList[1].gfxObject.position.setX(-0.25);
        initialItemList[2].gfxObject.position.setX(0.25);
        
        initialItemList.forEach(item => Gfx.addObject(item.gfxObject));
    },

    ondragend(gfxObject) {
        let item = gfxObject.userData;
        let itemList = Gfx.objects.map(gfxObject => gfxObject.userData);
        let collidedItem = item.findCollidedItem(itemList);
        if (collidedItem) {
            let resultItem = item.mergeWith(collidedItem);
            Gfx.addObject(resultItem.gfxObject, collidedItem.gfxObject);
            Gfx.removeObject(item.gfxObject);
            Gfx.removeObject(collidedItem.gfxObject);
        }
    },
}

export default Game;