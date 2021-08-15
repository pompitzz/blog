class Map {
    constructor() {
        this.map = {};
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

export {Map}
