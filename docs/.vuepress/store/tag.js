import {TagMap} from '../utils/map.js';

function getTagStore() {
    const tagStore = new TagMap();
    tagStore.put('Java', new Tag('Java', '#eb2025'));
    tagStore.put('JavaScript', new Tag('JavaScript', '#b9ad86'));
    tagStore.put('Vue.js', new Tag('Vue.js', '#42b983'));
    tagStore.put('Vuetify', new Tag('Vue.js', '#1b69c2'));
    tagStore.put('Spring', new Tag('Spring', '#6cb33e'));
    tagStore.put('Refactoring', new Tag('Refactoring', '#e06717'));
    return tagStore;
}

class Tag {
    constructor(tagName, color) {
        this.tagName = tagName;
        this.color = color;
        this.count = 0;
    }
}

export {getTagStore, Tag}