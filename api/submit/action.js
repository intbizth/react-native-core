const SUBMIT = 'SUBMIT';
const SUBMIT_VALIDATION_FAILED = 'SUBMIT_VALIDATION_FAILED';
const SUBMIT_FAILURE = 'SUBMIT_FAILURE';
const SUBMIT_SUCCESS = 'SUBMIT_SUCCESS';

export function createSubmitTypes(base) {
    return [SUBMIT, SUBMIT_VALIDATION_FAILED, SUBMIT_SUCCESS, SUBMIT_FAILURE].reduce((acc, type) => {
        acc[type] = `${base}_${type}`;
        return acc
    }, {});
}


export const AbstractSubmitAction = (entity) => {
    return {
        submit: (payload) => ({
            type: entity.SUBMIT,
            payload
        }),
        _submitSuccess_: (data, meta) => ({
            type: entity.SUBMIT_SUCCESS,
            data,
            __meta__: meta
        }),
        _submitValidationFailed_: (errors, meta) => ({
            type: entity.SUBMIT_VALIDATION_FAILED,
            errors,
            __meta__: meta
        }),
        _submitFailure_: (errors, meta) => ({
            type: entity.SUBMIT_FAILURE,
            errors,
            __meta__: meta
        }),
    }
};


// Hacking PhpStorm Resolve path
(() => ({
    SUBMIT,
    SUBMIT_SUCCESS,
    SUBMIT_FAILURE,
    SUBMIT_VALIDATION_FAILED
}))();