import GameItem from './GameItem.mjs';

const initialItemList = [
    GameItem.createFromCycleNotation('(1,2)', 6),
    GameItem.createFromCycleNotation('(1,2)(3,4)(5,6)', 6),
    GameItem.createFromCycleNotation('(1,2,3,4)(5,6)', 6),
];

export default {

    gfx: null,

    start(Gfx) {

        this.gfx = Gfx;
        this.gfx.dragend = (gfxObject) => this.ondragend(gfxObject);

        this.addInitialItems();
    },

    addInitialItems() {
        initialItemList[0].gfxObject.position.setX(-0.75);
        initialItemList[1].gfxObject.position.setX(-0.25);
        initialItemList[2].gfxObject.position.setX(0.25);
        
        initialItemList.forEach(item => this.gfx.addObject(item.gfxObject));
    },

    ondragend(gfxObject) {
        let item = gfxObject.userData;
        let itemList = this.gfx.objects.map(gfxObject => gfxObject.userData);
        let collidedItem = item.findCollidedItem(itemList);
        if (collidedItem) {
            let resultItem = item.mergeWith(collidedItem);
            this.gfx.addObject(resultItem.gfxObject, collidedItem.gfxObject);
            this.gfx.removeObject(item.gfxObject);
            this.gfx.removeObject(collidedItem.gfxObject);
        }
    },
}
