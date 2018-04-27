'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var shell = require('shelljs');
var colors = require('colors/safe');

/**
 * The unified version of 'path.join'. It forces forward slash ('/') on both unix like or windows system.
 * It also normalizes the path to emmit double slash and '..'.
 * @alias module:utils.joinPath
 *
 * @example
 * const utils = require('rekit-core').utils;
 * const p1 = utils.joinPath('c:\\abc', '../def');
 * // p1 => 'c:/def'
 **/
function joinPath() {
    // A consistent and normalized version of path.join cross platforms
    return path.normalize(path.join.apply(path, arguments)).replace(/\\/g, '/');
}

function info(msg) {
    if (global.__TEST__) {
        return;
    }
    console.log(colors.blue(msg));
}
function error(msg) {
    if (!global.__TEST__) {
        console.log(colors.red(msg));
    }
    throw new Error(msg);
}
function success(msg) {
    if (global.__TEST__) {
        return;
    }
    console.log(colors.green(msg));
}

var featureDir = {};
function getFeatureFolder(feature) {
    if (featureDir[feature]) {
        return featureDir[feature];
    }

    var projectRoot = getProjectRoot();
    var featureFolder = '';

    if (fs.existsSync(projectRoot + 'src/features')) {
        featureFolder = featureDir[feature] = projectRoot + 'src/features/' + feature;
        return featureFolder;
    }

    featureDir[feature] = featureFolder = projectRoot + 'features/' + feature;
    return featureFolder;
}

function getCommonFolder() {
    var projectRoot = getProjectRoot();
    if (fs.existsSync(projectRoot + 'src/common')) {
        return projectRoot + 'src/common';
    }

    return projectRoot + 'common';
}

function getReduxFolder(feature) {
    return getFeatureFolder(feature) + '/redux';
}

var pkgJson = null;
/**
 * Get the current project's package.json.
 **/
function getPkgJson() {
    // Get the project package json
    if (!pkgJson) {
        var pkgJsonPath = joinPath(getProjectRoot(), 'package.json');
        pkgJson = require(pkgJsonPath);
    }
    return pkgJson;
}

var prjRoot = void 0;
/**
 * Get the project root. By default it finds the Rekit project root of which the command is run.
 **/
function getProjectRoot() {
    if (!prjRoot) {
        var cwd = process.cwd();
        var lastDir = null;
        // Traverse above until find the package.json.
        while (cwd && lastDir !== cwd) {
            var pkgPath = joinPath(cwd, 'package.json');
            if (shell.test('-e', pkgPath)) {
                // eslint-disable-line
                prjRoot = cwd;
                break;
            }
            lastDir = cwd;
            cwd = joinPath(cwd, '..');
        }

        prjRoot = joinPath(/\/$/.test(prjRoot) ? prjRoot : prjRoot + '/');
        if (global.__TEST__) {
            prjRoot = prjRoot + 'test/mock/';
        }
    }

    return prjRoot;
}

module.exports = {
    getPkgJson: getPkgJson,
    getProjectRoot: getProjectRoot,
    getCommonFolder: getCommonFolder,
    getReduxFolder: getReduxFolder,
    getFeatureFolder: getFeatureFolder,
    info: info,
    success: success,
    error: error
};