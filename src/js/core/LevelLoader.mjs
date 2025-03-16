export default {

    worldList: [],
    worlds: [],
    lab: null,

    async configure() {
        this.worldList = await fetch('assets/levels/worlds.json')
            .then(res => res.json());
        await Promise.all(this.worldList.map(async name => {
            await this.fetchPack(name);
        }));
        this.lab = await fetch('assets/levels/lab.json')
            .then(res => res.json());
    },

    async fetchPack(name) {
        return fetch(`assets/levels/${name}.json`)
            .then(res => res.json())
            .then(packData => this.worlds[name] = packData)
            .catch(err => { throw err });
    },

    loadLevelSchema(world, levelIndex) {
        return this.worlds[world].levels[levelIndex];
    },

    loadLabSchema() {
        return this.lab;
    },
}