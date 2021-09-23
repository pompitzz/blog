import { Map } from '../utils/map.js';

function getTagStore() {
    const tagStore = new TagMap();
    tagStore.put(new Tag('Java', '#eb2025'));
    tagStore.put(new Tag('Kotlin', '#7882e3'));
    tagStore.put(new Tag('Groovy', '#6398aa'));
    tagStore.put(new Tag('Spring', '#6cb33e'));
    tagStore.put(new Tag('AWS', '#ec912e'));
    tagStore.put(new Tag('Vue.js', '#42b882'));
    tagStore.put(new Tag('VuePress', '#e06717'));
    tagStore.put(new Tag('Cassandra', '#2c88b2'));
    tagStore.put(new Tag('Network', '#41b3b6'));
    tagStore.put(new Tag('Design', '#21ac09'));
    // tagStore.put('JavaScript', new    Tag('JavaScript', '#b9ad86'));
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

    put(tag) {
        this.map.put(tag.tagName, tag);
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
        this.map.put('ALL', new Tag('ALL', '#b9ad86', posts.length));
        return this.values();
    }

    color(key) {
        return this.map.get(key).color ? this.map.get(key).color : '#00618a';
    }
}

export {
    getTagStore,
};
