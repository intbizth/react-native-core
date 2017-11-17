const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const DISMISS = 'DISMISS';


export function createRequestTypes(base) {
    return [REQUEST, SUCCESS, FAILURE, DISMISS].reduce((acc, type) => {
        acc[type] = `${base}_${type}`;
        return acc
    }, {})
}


export const AbstractRequestAction = (entity) => ({
    request: (payload) => ({
        type: entity.REQUEST,
        payload
    }),
    _success_: (data, meta) => ({
        type: entity.SUCCESS,
        data,
        __meta__: meta
    }),
    _failure_: (errors, meta) => ({
        type: entity.FAILURE,
        errors,
        __meta__: meta
    }),
    dismiss: () => ({
        type: entity.DISMISS
    }),
});


// Hacking PhpStorm Resolve path
(() => ({
    REQUEST,
    SUCCESS,
    FAILURE,
    DISMISS
}))();