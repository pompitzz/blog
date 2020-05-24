function toArray(datas) {
    const array = [];
    for (let index in datas) {
        array.push(datas[index]);
    }
    return array;
}

export {toArray};