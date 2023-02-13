import Gfx from './Gfx.mjs';
import Game from '../core/Game.mjs';
import GameLoader from '../core/GameLoader.mjs';
import GameGfxItem from './GameGfxItem.mjs';
import { Object3D } from 'three';
import GameItem from '../core/GameItem.mjs';

const GameGfx = {

    /**
     * @type {Game}
     */
    game: null,
    resultShown: false,

    async configure() {
        await GameGfxItem.configure();
        Gfx.configure();
    },

    start() {
        Gfx.dragend = (gfxObject) => GameGfx.ondragend(gfxObject);

        Gfx.start();

        this.game = GameLoader.loadDefaultLevel();
        this.addInitialItems();
    },

    stop() {
        Gfx.stop();
    },

    reset() {
        Gfx.objects.forEach(gfxObject => Gfx.removeObject(gfxObject));
        this.game.reset();
        this.resultShown = false;
        this.addInitialItems();
    },

    addInitialItems() {
        let initialItemList = this.game.getItems().map(GameGfxItem.createInstance);

        initialItemList[0].gfxObject.position.setX(-0.75);
        initialItemList[1].gfxObject.position.setX(-0.25);
        initialItemList[2].gfxObject.position.setX(0.25);
        
        initialItemList.forEach(item => Gfx.addObject(item.gfxObject));
    },

    /**
     * @param {Object3D} gfxObject 
     * @returns {GameGfxItem}
     */
    getGfxItemFromObject(gfxObject) {
        return gfxObject.userData;
    },

    ondragend(gfxObject) {
        let gfxItem = this.getGfxItemFromObject(gfxObject);
        let gfxItemList = Gfx.objects.map(this.getGfxItemFromObject);
        let collidedItem = gfxItem.findCollidedItem(gfxItemList);
        if (collidedItem) {
            this.mergeItems(gfxItem, collidedItem);
        }
    },

    mergeItems(movedGfxItem, collidedGfxItem) {
        let resultGameItem = this.game.mergeItem(
            movedGfxItem.gameItem.getId(),
            collidedGfxItem.gameItem.getId()
        );
        let resultGfxItem = GameGfxItem.createInstance(resultGameItem);
        Gfx.addObject(resultGfxItem.gfxObject, collidedGfxItem.gfxObject);
        Gfx.removeObject(movedGfxItem.gfxObject);
        Gfx.removeObject(collidedGfxItem.gfxObject);
        this.checkWinning();
    },

    checkWinning() {
        if (this.resultShown) {
            return;
        }
        let winningResult = this.game.getWinningResult();
        if (winningResult == null) {
            return;
        }
        let messageModal = document.querySelector('.message-modal');
        let messageTag = messageModal.querySelector('.message');
        messageTag.innerHTML = winningResult ? "You Win!" : "You Lose!";
        messageModal.style.display = "block";
        this.resultShown = true;
    },
}

export default GameGfx;