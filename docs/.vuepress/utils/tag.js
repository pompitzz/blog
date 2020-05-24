import {Map} from './map.js';

function tagStore() {
    const tagStore = new Map();
    tagStore.put('Java', new Tag('Java', '#eb2025'));
    tagStore.put('Jvm', new Tag('Jvm', '#0261a7'));
    tagStore.put('Database', new Tag('Database', '#38749b'));
    tagStore.put('Refactoring', new Tag('Refactoring', '#e06717'));
    tagStore.put('MySql', new Tag('MySql', '#00618a'));
    tagStore.put('AWS', new Tag('AWS', '#ff9901'));
    tagStore.put('Vue.js', new Tag('Vue.js', '#42b983'));
    tagStore.put('Spring', new Tag('Spring', '#6cb33e'));
    tagStore.put('JPA', new Tag('JPA', '#b9ad86'));
    tagStore.put('JavaScript', new Tag('JavaScript', '#b9ad86'));
    return tagStore;
}

class Tag {
    constructor(tagName, color) {
        this.tagName = tagName;
        this.color = color;
        this.count = 0;
    }
}

export {tagStore, Tag}