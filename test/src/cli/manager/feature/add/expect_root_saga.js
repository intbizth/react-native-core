import { all } from 'redux-saga/effects';
import * as pageSagas from '../features/page/redux/sagas';
import * as fooFeatureSagas from '../features/foo-feature/redux/sagas';

const featureSagas = [
    pageSagas,
    fooFeatureSagas,
];

const sagas = featureSagas.reduce((prev, curr) => [
    ...prev,
    ...Object.keys(curr).map(k => curr[k]),
], [])
    .filter(s => typeof s === 'function');

const rootSaga = function* rootSaga() {
    yield all(sagas.map(saga => saga()));
};

export default rootSaga;
