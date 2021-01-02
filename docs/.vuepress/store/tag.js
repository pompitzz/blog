import {TagMap} from '../utils/map.js';

function getTagStore() {
    const tagStore = new TagMap();
    tagStore.put('JAVA', new Tag('JAVA', '#eb2025'));
    tagStore.put('Groovy', new Tag('Groovy', '#6398aa'));
    // tagStore.put('Refactoring', new Tag('Refactoring', '#e06717'));
    tagStore.put('Spring', new Tag('Spring', '#6cb33e'));
    tagStore.put('AWS', new Tag('AWS', '#ec912e'));
    tagStore.put('Vue.js', new Tag('Vue.js', '#42b882'));
    // tagStore.put('Vuetify', new Tag('Vue.js', '#1b69c2'));
    tagStore.put('VuePress', new Tag('VuePress', '#e06717'));
    // tagStore.put('JavaScript', new Tag('JavaScript', '#b9ad86'));
    // tagStore.put('Gradle', new Tag('Gradle', '#046231'));
    return tagStore;
}

class Tag {
    constructor(tagName, color, count=0) {
        this.tagName = tagName;
        this.color = color;
        this.count = count;
    }
}

export {
    getTagStore,
    Tag
}