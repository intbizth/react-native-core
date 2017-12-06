const fs = require('fs');
const colors = require('colors/safe');
const _ = require('lodash');
const refactor = require('../refactor');
const constant = require('./constant');
const action = require('./action');
const saga = require('./saga');
const entry = require('./entry');
const reducer = require('./reducer');

function make(feature, name, options) {
    const featureReduxFolder = refactor.getReduxFolder(feature);
    if (!fs.existsSync(featureReduxFolder)) {
        console.log(colors.red(`Feature name "${feature}" not exists in your project.`))
        throw new Error;
    }

    const constantName = constant.add(feature, name, options);
    const actionName = action.add(feature, name, options, constantName);
    const sagaName = saga.add(feature, name, options, actionName, constantName);
    const reducerName = reducer.add(feature, name, options, constantName);
    entry.linkSaga(feature, name, options, sagaName);
    entry.linkReducer(feature, name, options, reducerName);
    refactor.flush();

    console.log(colors.green('Complete ;))'))
}

module.exports = { make };
