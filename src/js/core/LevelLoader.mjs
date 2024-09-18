import levelsW0Path from '../../assets/levels-w0.json';
import levelsW1Path from '../../assets/levels-w1.json';
import levelsWtestPath from '../../assets/levels-wtest.json';

export default {

    levels: {},

    async configure() {
        await this.fetch('w0', levelsW0Path);
        await this.fetch('w1', levelsW1Path);
        await this.fetch('wtest', levelsWtestPath);
    },

    async fetch(world, worldPath) {
        return fetch(worldPath)
            .then(res => res.json())
            .then(json => this.levels[world] = json)
            .catch(err => { throw err });
    },

    getLevelList(world) {
        return this.levels[world];
    },

    loadLevelSchema(world, levelId) {
        return this.levels[world].find(level => level.id == levelId);
    }
}