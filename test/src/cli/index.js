/* eslint-disable */
exports.test = () => {
    before(function (){
        global.__TEST__ = true;
    });

    describe('Command line tools', () => {
        describe('Refactor function', () => {
            require('./refactor').test();
        });
        describe('Core function', () => {
            require('./core').test();
        });
        describe('Manager function', () => {
            require('./manager').test();
        });
    });
};
