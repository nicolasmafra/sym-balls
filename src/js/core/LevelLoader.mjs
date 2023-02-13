import levels from '../../assets/levels.json';

export default {
    getLevelList() {
        return levels;
    },

    loadLevelSchema(levelId) {
        return levels.find(level => level.id == levelId);
    }
}