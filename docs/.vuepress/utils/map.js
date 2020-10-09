import {Tag} from "../store/tag";

class Map {
    constructor() {
        this.map = [];
    }

    put(key, value) {
        this.map[key] = value;
    }

    values() {
        const values = [];
        for (let key in this.map) {
            values.push(this.map[key]);
        }
        return values;
    }

    keys() {
        const keys = [];
        for (let key in this.map) {
            keys.push(key);
        }
        return keys;
    }

    get(key) {
        return this.map[key];
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
        return this.values();
    }

    color(key) {
        return this.map.get(key).color ? this.map.get(key).color : '#00618a';
    }
}

export {TagMap}
