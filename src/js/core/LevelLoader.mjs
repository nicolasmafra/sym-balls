export default {

    levels: {},

    async configure() {
        await this.fetch('w0', 'assets/levels-w0.json');
        await this.fetch('w1', 'assets/levels-w1.json');
        await this.fetch('wtest', 'assets/levels-wtest.json');
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