import {combineReducers} from 'redux';
import reduceReducers from 'reduce-reducers';
import pageReducer from '../features/page/redux/reducer';

const featureReducers = {
    page: pageReducer,
};

export default reduceReducers(
    combineReducers(featureReducers),
    // Accoss state https://github.com/reactjs/redux/issues/749
    (state) => {
        // Do stuff
        return state;
    }
);
