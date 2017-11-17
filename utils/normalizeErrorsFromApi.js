import forEach from 'lodash/forEach';

export default function normalizeErrorsFromApi(errors) {
    let errorsNormalized = [];
    forEach(errors.children, (err) => {
        let newErrors = (err.errors) ? err.errors : normalizeErrorsFromApi(err);
        errorsNormalized = [...errorsNormalized, ...newErrors];
    });

    return errorsNormalized;
}
