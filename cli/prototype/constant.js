module.exports = {
    constant: `export const {%=o.constName%} = {%=o.constCreator%}("{%=o.constName%}");`,
    constantWithReducer: `export const {%=o.constName%} = "{%=o.stateKey%}";`
};
