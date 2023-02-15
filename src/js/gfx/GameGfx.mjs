import Gfx from './Gfx.mjs';
import Game from '../core/Game.mjs';
import GameLoader from '../core/GameLoader.mjs';
import GameGfxItem from './GameGfxItem.mjs';
import { Object3D, Vector3 } from 'three';
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
        Gfx.dragstart = (gfxObject) => GameGfx.ondragstart(gfxObject);

        Gfx.start();

        this.game = GameLoader.loadGameFromLevelSchema(this.levelSchema);
        this.addDockItems();
        this.reset();
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

    addDockItems() {
        let items = this.game.getDockItems().map(GameGfxItem.createInstance);
        let rowOffset = (items.length - 1) / 2;
        items.forEach((item, i) => {
            item.gfxObject.position.setY(itemSpacing * (i - rowOffset));
            Gfx.addObject(item.gfxObject, Gfx.dock);
        })

    },

    addInitialItems() {
        let items = this.game.getItems().map(GameGfxItem.createInstance);

        let root = Math.ceil(Math.sqrt(items.length));
        if (root < 4) root = 4;
        let rows = Math.ceil(items.length / root);
        let cols = root;
        let rowOffset = (rows-1)/2;
        let colOffset = (cols-1)/2;
        items.forEach((item, i) => {
            let row = Math.floor(i / cols);
            let col = i % cols;

            item.setPosition(new Vector3(
                itemSpacing * (col - colOffset) - Gfx.dockWidth/2,
                -itemSpacing * (row - rowOffset),
                0
            ));
            Gfx.addObject(item.gfxObject);
        });
    },

    /**
     * @param {Object3D} gfxObject 
     * @returns {GameGfxItem}
     */
    getGfxItemFromObject(gfxObject) {
        return gfxObject.userData;
    },

    ondragstart(gfxObject) {
        let gfxItem = this.getGfxItemFromObject(gfxObject);
        if (gfxItem.gameItem.isLocked()) {
            this.showMessage("Can't move: item is locked!");
            gfxItem.resetPosition();
            return;
        }
    },

    ondragend(gfxObject) {
        let gfxItem = this.getGfxItemFromObject(gfxObject);
        let gfxItemList = Gfx.objects.map(this.getGfxItemFromObject);
        let collidedItem = gfxItem.findCollidedItem(gfxItemList);
        if (collidedItem) {
            try {
                this.mergeItems(gfxItem, collidedItem);
            } catch (e) {
                console.error(e);
                this.showMessage("Error: " + e.message);
                gfxItem.resetPosition();
            }
        }
    },

    mergeItems(movedGfxItem, collidedGfxItem) {
        let resultGameItem = this.game.mergeItem(
            movedGfxItem.gameItem.getId(),
            collidedGfxItem.gameItem.getId()
        );
        let resultGfxItem = GameGfxItem.createInstance(resultGameItem);
        Gfx.addObject(resultGfxItem.gfxObject, collidedGfxItem.gfxObject);
        resultGfxItem.fixPosition();
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
        this.showMessage(winningResult ? "You Win!" : "You Lose!");
        this.resultShown = true;
    },

    showMessage(message) {
        let messageModal = document.querySelector('.message-modal');
        let messageTag = messageModal.querySelector('.message');
        messageTag.innerHTML = message;
        messageModal.style.display = "block";
    }
}

export default GameGfx;