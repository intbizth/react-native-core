'use strict';

var _ = require('lodash');
var tmpl = require('blueimp-tmpl');
var refactor = require('../refactor');
var prototype = require('../prototype/router');

var FILENAME = 'router.js';

function init(feature) {
    var targetPath = refactor.getFeatureFolder(feature) + '/' + FILENAME;
    var routerLines = [];
    refactor.writeLine(routerLines, 0, tmpl(prototype, {}));
    refactor.save(targetPath, routerLines);

    refactor.success(targetPath + ' was created');
}

module.exports = {
    init: init,
    FILENAME: FILENAME
};