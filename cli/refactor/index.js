const array = require('./array');
const common = require('./common');
const file = require('./file');
const identifier = require('./identifier');
const importExport = require('./importExport');
const lines = require('./lines');
const utils = require('./utils');
const vio = require('./vio');
const object = require('./object');

module.exports = {
    ...array,
    ...common,
    ...identifier,
    ...file,
    ...importExport,
    ...lines,
    ...utils,
    ...vio,
    ...object
};
