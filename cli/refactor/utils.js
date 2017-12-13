const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const shell = require('shelljs');
const colors = require('colors/safe');


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


let featureDir = {};
function getFeatureFolder(feature) {
    if (featureDir[feature]) {
        return featureDir[feature];
    }

    const projectRoot = getProjectRoot();
    let featureFolder = '';

    if (fs.existsSync(`${projectRoot}src/features`)) {
        featureFolder = featureDir[feature] = `${projectRoot}src/features/${feature}`;
        return featureFolder;
    }

    featureDir[feature] = featureFolder = `${projectRoot}features/${feature}`;
    return featureFolder;
}

function getReduxFolder(feature) {
    return `${getFeatureFolder(feature)}/redux`;
}

let pkgJson = null;
/**
 * Get the current project's package.json.
 **/
function getPkgJson() {
    // Get the project package json
    if (!pkgJson) {
        const pkgJsonPath = joinPath(getProjectRoot(), 'package.json');
        pkgJson = require(pkgJsonPath);
    }
    return pkgJson;
}

let prjRoot;
/**
 * Get the project root. By default it finds the Rekit project root of which the command is run.
 **/
function getProjectRoot() {
    if (!prjRoot) {
        let cwd = process.cwd();
        let lastDir = null;
        // Traverse above until find the package.json.
        while (cwd && lastDir !== cwd) {
            const pkgPath = joinPath(cwd, 'package.json');
            if (shell.test('-e', pkgPath)) { // eslint-disable-line
                prjRoot = cwd;
                break;
            }
            lastDir = cwd;
            cwd = joinPath(cwd, '..');
        }

        prjRoot = joinPath(/\/$/.test(prjRoot) ? prjRoot : (prjRoot + '/'));
        if (global.__TEST__) {
            prjRoot = prjRoot + 'test/mock/';
        }
    }

    return prjRoot;
}

module.exports = {
    getPkgJson,
    getProjectRoot,
    getReduxFolder,
    getFeatureFolder,
    info,
    success,
    error,
};
