export default (val, length) => {
    if ('string' !== typeof val) {
        console.info(`${val} should be string`);
        return false;
    }

    return val.length < length;
}
