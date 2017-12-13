'use strict';

var refactor = require('../refactor');

var FILENAME = 'selectors.js';

function init(feature) {
    var targetPath = refactor.getReduxFolder(feature) + '/' + FILENAME;
    refactor.save(targetPath, []);
    refactor.success(targetPath + ' was created');
}

module.exports = {
    init: init,
    FILENAME: FILENAME
};