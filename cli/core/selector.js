const refactor = require('../refactor');

const FILENAME = 'selectors.js'

function init(feature) {
    const targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    refactor.save(targetPath, []);
    refactor.success(`${targetPath} was created`);
}

module.exports = {
    init,
    FILENAME
};
