import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';
import pageReducer from '../features/page/redux/reducer';
import newFeatureReducer from '../features/new-feature/redux/reducer';

const featureReducers = {
    page: pageReducer,
    newFeature: newFeatureReducer,
};

export default reduceReducers(
    combineReducers(featureReducers),
    // Accoss state https://github.com/reactjs/redux/issues/749
    (state) => {
        // Do stuff
        return state;
    }
);
