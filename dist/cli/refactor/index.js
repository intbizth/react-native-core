'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var array = require('./array');
var common = require('./common');
var file = require('./file');
var importExport = require('./importExport');
var lines = require('./lines');
var utils = require('./utils');
var vio = require('./vio');
var object = require('./object');

module.exports = _extends({}, array, common, file, importExport, lines, utils, vio, object);