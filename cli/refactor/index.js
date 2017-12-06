const array = require('./array');
const common = require('./common');
const identifier = require('./identifier');
const importExport = require('./importExport');
const lines = require('./lines');
const utils = require('./utils');
const vio = require('./vio');

module.exports = {
    ...array,
    ...common,
    ...identifier,
    ...importExport,
    ...lines,
    ...utils,
    ...vio,
};
