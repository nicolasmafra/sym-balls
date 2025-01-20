import GUI from '../GUI.mjs';
import Gfx from './Gfx.mjs';
import Game from '../core/Game.mjs';
import GameLoader from '../core/GameLoader.mjs';
import GameGfxItem from './GameGfxItem.mjs';
import { Object3D, Vector3 } from 'three';
import GameItem from '../core/GameItem.mjs';

const itemSpacing = 0.4;
const allowUseDockWithoutMerge = false;

const GameGfx = {

    /**
     * @type {Game}
     */
    game: null,
    resultShown: false,
    levelSchema: null,

    async configure() {
        await GameGfxItem.configure();
    },

    setLevelSchema(levelSchema) {
        this.levelSchema = levelSchema;
    },

    start() {
        if (!Gfx.configured) {
            Gfx.configure();
        }
        Gfx.dragend = (gfxObject) => GameGfx.ondragend(gfxObject);
        Gfx.dragstart = (gfxObject) => GameGfx.ondragstart(gfxObject);

        Gfx.start();

        this.game = GameLoader.loadGameFromLevelSchema(this.levelSchema);
        this.reset();
    },

    stop() {
        Gfx.stop();
    },

    reset() {
        Gfx.resetTime();
        Gfx.objects.forEach(gfxObject => Gfx.removeObject(gfxObject));
        this.game.reset();
        this.resultShown = false;
        this.addDockItems();
        this.addInitialItems();

        if (this.levelSchema.tip) {
            GUI.showMessage(this.levelSchema.tip);
        }
    },

    addDockItems() {
        let items = this.game.getDockItems().map(GameGfxItem.createInstance);
        items.forEach(gfxItem => gfxItem.isOnDock = true);
        let rowOffset = (items.length - 1) / 2;
        items.forEach((item, i) => {
            item.setPosition(new Vector3(
                Gfx.dock.position.x,
                itemSpacing * (i - rowOffset),
                0
            ));
            Gfx.addObject(item.gfxObject);
        })

    },

    addInitialItems() {
        let items = this.game.getItems().map(GameGfxItem.createInstance);

        let root = Math.ceil(Math.sqrt(items.length));
        if (root < 3) root = 3;
        let rows = Math.ceil(items.length / root);
        let cols = root;
        let rowOffset = (rows-1)/2;
        let colOffset = (cols-1)/2;
        items.forEach((item, i) => {
            let row = Math.floor(i / cols);
            let col = i % cols;

            item.setPosition(new Vector3(
                itemSpacing * (col - colOffset) - Gfx.dockRadius,
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
        if (!(gfxItem instanceof GameGfxItem)) {
            Gfx.cancelDrag();
            return;
        }
        if (gfxItem.gameItem.isLocked()) {
            Gfx.cancelDrag();
            GUI.showMessage('Item locked, use the dock!');
            gfxItem.resetPosition();
            return;
        }
    },

    ondragend(gfxObject) {
        let gfxItem = this.getGfxItemFromObject(gfxObject);

        let gfxItemList = Gfx.objects.map(this.getGfxItemFromObject)
            .filter(gi => !this.game.isOnDock(gi.gameItem.getId()));
        let collidedItem = gfxItem.findCollidedItem(gfxItemList);

        if (this.game.isOnDock(gfxItem.gameItem.getId())) {
            let realItem = gfxItem;
            if (collidedItem || allowUseDockWithoutMerge) {
                gfxItem = this.addGfxItemFromDock(gfxItem);
            }
            realItem.resetPosition();
        }

        if (collidedItem) {
            try {
                this.mergeItems(gfxItem, collidedItem);
            } catch (e) {
                console.error(e);
                GUI.showMessage("Error: " + e.message);
                gfxItem.resetPosition();
            }
        }
    },

    addGfxItemFromDock(gfxItem) {
        let newItem = this.game.addItemFromDock(gfxItem.gameItem.getId());
        let newGfxItem = GameGfxItem.createInstance(newItem);
        newGfxItem.setPosition(gfxItem.gfxObject.position);
        Gfx.addObject(newGfxItem.gfxObject);
        return newGfxItem;
    },

    mergeItems(movedGfxItem, collidedGfxItem) {
        let resultGameItem = this.game.mergeItem(
            movedGfxItem.gameItem.getId(),
            collidedGfxItem.gameItem.getId()
        );
        if (resultGameItem) {
            let resultGfxItem = GameGfxItem.createInstance(resultGameItem);
            resultGfxItem.setPosition(collidedGfxItem.gfxObject.position);
            Gfx.addObject(resultGfxItem.gfxObject);
        }
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
        GUI.showMessage(winningResult ? 'You won!' : 'You lost!');
        this.resultShown = true;
    },
}

export default GameGfx;