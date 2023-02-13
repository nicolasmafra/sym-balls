import Gfx from './Gfx.mjs';
import GameItemGfx from './GameItemGfx.mjs';

const levelLength = 6;
const levelInitialItems = [
    '(1,2)(3,4)(5,6)',
    '(1,3)',
    '(1,2,3,4)(5,6)',
];

const GameGfx = {

    start() {
        Gfx.dragend = (gfxObject) => GameGfx.ondragend(gfxObject);

        Gfx.start();

        GameGfx.addInitialItems();
    },

    stop() {
        Gfx.stop();
    },

    reset() {
        Gfx.objects.forEach(gfxObject => Gfx.removeObject(gfxObject));

        GameGfx.addInitialItems();
    },

    addInitialItems() {
        let initialItemList = levelInitialItems.map(text => {
            return GameItemGfx.createFromCycleNotation(text, levelLength);
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

export default GameGfx;