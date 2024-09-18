export default {

    fromOneLineNotation(text, separator='') {
        return text.split(separator)
                .map(c => Number(c) - 1)
    },

    fromCycleNotation(text) {
        const regex = /^(\(([0-9]+,?)+\))+$/
        if (!text.match(regex)) throw new Error('Invalid cycle notation text: ' + text);

        let separator = text.includes(',') ? ',' : '';
        return text.substring(1, text.length -1)
                .split(/\)\(+/)
                .map(cyclePart => this.fromOneLineNotation(cyclePart, separator));
    },
}