import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';

export default function normalizeErrorsFromApi(errors) {
    let errorsNormalized = [];
    forEach(errors.children, (err) => {
        let newErrors = (err.errors) ? err.errors : normalizeErrorsFromApi(err);
        errorsNormalized = [...errorsNormalized, ...newErrors];
    });

    if (isArray(errors.errors)) {
        errorsNormalized = [...errorsNormalized, ...errors.errors];
    }

    return errorsNormalized;
}
