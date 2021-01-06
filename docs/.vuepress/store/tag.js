import {Map} from '../utils/map.js';

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
    constructor(tagName, color, count = 0) {
        this.tagName = tagName;
        this.color = color;
        this.count = count;
    }
}

class TagMap {
    constructor() {
        this.map = new Map();
    }

    put(key, value) {
        this.map.put(key, value);
    }

    values() {
        return this.map.values();
    }

    countingPosts(posts) {
        for (let index in posts) {
            const post = posts[index];
            if (!post.frontmatter) continue;
            for (let index in post.frontmatter.tags) {
                const tagName = post.frontmatter.tags[index];
                if (this.map.get(tagName)) {
                    this.map.get(tagName).count += 1;
                } else {
                    this.map.put(tagName, new Tag(tagName, '#00618a'));
                }
            }
        }
    }

    getTagsWithCouting(posts) {
        this.countingPosts(posts);
        this.put("ALL", new Tag("ALL", "#b9ad86", posts.length))
        return this.values();
    }

    color(key) {
        return this.map.get(key).color ? this.map.get(key).color : '#00618a';
    }
}

export {
    getTagStore
}
