export default {

    worlds: {},

    async configure() {
        let names = await fetch('assets/levels/packs.json')
            .then(res => res.json());
        await Promise.all(names.map(async name => {
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