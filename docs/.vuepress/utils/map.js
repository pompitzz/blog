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
        posts.forEach(post =>
            post.tags.forEach(tagName => {
                if (this.map[tagName]) {
                    this.map[tagName].count += 1;
                } else {
                    this.map[tagName] = new Tag(tagName, '#00618a');
                }
            }));
    }

    color(tagName) {
        return this.map[tagName].color ? this.map[tagName].color : '#00618a';
    }
}

export {Map}