import { all } from 'redux-saga/effects';
import * as pageSagas from '../features/page/redux/sagas';
import * as newFeatureSagas from '../features/new-feature/redux/sagas';

const featureSagas = [
    pageSagas,
    newFeatureSagas,
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
