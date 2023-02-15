import Gfx from './Gfx.mjs';
import Game from '../core/Game.mjs';
import GameLoader from '../core/GameLoader.mjs';
import GameGfxItem from './GameGfxItem.mjs';
import { Object3D } from 'three';
import GameItem from '../core/GameItem.mjs';

const itemSpacing = 0.7;

const GameGfx = {

    /**
     * @type {Game}
     */
    game: null,
    resultShown: false,
    levelSchema: null,

    async configure() {
        await GameGfxItem.configure();
        Gfx.configure();
    },

    setLevelSchema(levelSchema) {
        this.levelSchema = levelSchema;
    },

    start() {
        Gfx.dragend = (gfxObject) => GameGfx.ondragend(gfxObject);

        Gfx.start();

        this.game = GameLoader.loadGameFromObject(this.levelSchema);
        this.resultShown = false;
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
        let items = this.game.getItems().map(GameGfxItem.createInstance);

        let root = Math.ceil(Math.sqrt(items.length));
        if (root < 4) root = 4;
        let rows = Math.ceil(items.length / root);
        let cols = root;
        let rowOffset = (rows-1)/2;
        let colOffset = (cols-1)/2;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let row = Math.floor(i / cols);
            let col = i % cols;
            let position = item.gfxObject.position;
            position.setY(-itemSpacing * (row - rowOffset));
            position.setX(itemSpacing * (col - colOffset));
        }
        
        items.forEach(item => Gfx.addObject(item.gfxObject));
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