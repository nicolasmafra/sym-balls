export default {

    worldList: [],
    worlds: [],

    async configure() {
        this.worldList = await fetch('assets/levels/worlds.json')
            .then(res => res.json());
        await Promise.all(this.worldList.map(async name => {
            await this.fetchPack(name);
        }));
    },

    async fetchPack(name) {
        return fetch(`assets/levels/${name}.json`)
            .then(res => res.json())
            .then(packData => this.worlds[name] = packData)
            .catch(err => { throw err });
    },

    loadLevelSchema(world, levelIndex) {
        return this.worlds[world].levels[levelIndex];
    }
}