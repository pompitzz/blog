import {Tag} from "./tag";

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

    count(posts) {
        for (let index in posts) {
            const post = posts[index];
            if (!post.frontmatter) continue;
            for (let index in post.frontmatter.tags) {
                const tagName = post.frontmatter.tags[index];
                if (this.map[tagName]) {
                    this.map[tagName].count += 1;
                } else {
                    this.map[tagName] = new Tag(tagName, '#00618a');
                }
            }
        }
    }

    notContainsHtml(targetHtml) {
        for (let key in this.map) {
            if(targetHtml.startsWith(key)){
                return false;
            }
        }
        return true;
    }

    color(tagName) {
        return this.map[tagName].color ? this.map[tagName].color : '#00618a';
    }
}

export {Map}