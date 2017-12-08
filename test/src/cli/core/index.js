/* eslint-disable */
const _ = require('lodash');
const path = require('path');
const { walkSync } = require('../../../test');

exports.test = () => {
    const filesPath = walkSync(path.join(__dirname), [], 'test.js');

     _.forEach(filesPath, (filePath) => {
         require(filePath).test();
     })
};
