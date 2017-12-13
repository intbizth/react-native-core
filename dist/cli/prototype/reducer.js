"use strict";

module.exports = {
    init: "import initialState from './initialState';\n\nconst reducers = [\n\n];\n\nexport default function reducer(state = initialState, action = {}) {\n    let newState;\n    switch (action.type) {\n        // Handle cross-topic actions here\n        default:\n            newState = state;\n            break;\n    }\n    /* istanbul ignore next */\n    return reducers.reduce((s, r) => r(s, action), newState);\n}",
    make: "export const {%=o.reducerName%} = {%=o.reducer%}({%=o.constantName%}, {%=o.constantStateKeyName%});"
};