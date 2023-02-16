import levelsPath from '../../assets/levels.json';

export default {

    levels: null,

    async configure() {
        return fetch(levelsPath)
            .then(res => res.json())
            .then(json => this.levels = json)
            .catch(err => { throw err });
    },

    getLevelList() {
        return this.levels;
    },

    loadLevelSchema(levelId) {
        return this.levels.find(level => level.id == levelId);
    }
}