/* eslint-disable */
exports.test = () => {
    describe('Command line tools', () => {
        describe('Refactor function', () => {
            require('./refactor').test()
        });
    });
};
