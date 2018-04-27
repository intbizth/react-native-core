#!/usr/bin/env node
'use strict';

var inquirer = require('inquirer');
var program = require('commander');
var actionManager = require('./manager/action');
var featureManager = require('./manager/feature');

program.version('0.0.1').description('Core management system');

program.command('make').description('Make a request action with saga').action(function () {
    var questions = [{
        type: 'input',
        name: 'feature',
        message: "What's feature?"
    }, {
        type: 'input',
        name: 'name',
        message: 'What is action name?'
    }, {
        type: 'list',
        name: 'type',
        message: 'What type of action do you need?',
        choices: ['request', 'submit', 'paginate']
    }, {
        type: 'confirm',
        name: 'saga',
        message: 'Do you need saga ?',
        default: false
    }, {
        type: 'input',
        name: 'withSaga',
        message: 'Typing a filename of saga function (no need ".js")',
        when: function when(answers) {
            return answers.saga;
        }
    }, {
        type: 'confirm',
        name: 'reducer',
        message: 'Do you need reducer ?',
        default: false,
        when: function when(answers) {
            return answers.saga;
        }
    }, {
        type: 'input',
        name: 'withReducer',
        message: 'Typing a state key name',
        when: function when(answers) {
            return answers.reducer;
        }
    }];

    inquirer.prompt(questions).then(function (args) {
        actionManager.make(args);
        actionManager.flush();
    });
});

program.command('rm').description('Remove a request action with saga').action(function () {
    var questions = [{
        type: 'input',
        name: 'feature',
        message: "What's feature?"
    }, {
        type: 'input',
        name: 'name',
        message: 'What is action name?'
    }, {
        type: 'input',
        name: 'withSaga',
        message: 'Typing a filename of saga function (no need ".js")'
    }];

    inquirer.prompt(questions).then(function (args) {
        actionManager.remove(args);
        actionManager.flush();
    });
});

program.command('make-feature').description('Create a feature').action(function () {
    var questions = [{
        type: 'input',
        name: 'feature',
        message: "What's feature name?"
    }];

    inquirer.prompt(questions).then(function (args) {
        featureManager.add(args);
        featureManager.flush();
    });
});

program.command('rm-feature').description('Remove a feature').action(function () {
    var questions = [{
        type: 'input',
        name: 'feature',
        message: "What's feature name?"
    }];

    inquirer.prompt(questions).then(function (args) {
        featureManager.remove(args);
        featureManager.flush();
    });
});

program.parse(process.argv);