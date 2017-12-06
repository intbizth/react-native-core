#!/usr/bin/env node
const program = require('commander');
const { make } = require('./logics');

program
    .version('0.0.1')
    .description('Core management system')

;

program
    .command('make <feature> <action>')
    .option('-t --type <actionType>', 'Action type one of request|submit|paginate', /^(request|submit|paginate)$/i, 'request')
    .option('-s --with-saga <filename>', 'Make action with saga as well', /^(.*)$/)
    .option('-r --with-reducer <stateKey>', 'Make action with reducer as well')
    .description('Make a request action with saga')
    .action(make)
;

program.parse(process.argv);
