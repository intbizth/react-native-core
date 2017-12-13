'use strict';

var _ = require('lodash');

function makeFeatureFolderName(name) {
    return _.kebabCase(name);
}

module.exports = {
    makeFeatureFolderName: makeFeatureFolderName
};