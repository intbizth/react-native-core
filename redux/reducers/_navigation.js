import { NavigationActions } from 'react-navigation';
import { NAVIGATE_TO_ROOT } from '../constants';

export function navigateToRoot() {
    return {
        type: NAVIGATE_TO_ROOT,
    };
}

function getCurrentRoute(state) {
    if (state.routes) {
        return getCurrentRoute(state.routes[state.index]);
    }
    return state;
}

export function createNavigatorReducer(RootNavigator) {
    return (state = {}, action) => {
        let newState;
        switch (action.type) {
            //https://github.com/react-community/react-navigation/issues/1493
            case NAVIGATE_TO_ROOT:
                newState = RootNavigator.router.getStateForAction(NavigationActions.init());
                // newState.routes[0].index = RootNavigator.indexOf(action.routeName);
                return {
                    ...state,
                    nav: newState
                };
            // https://github.com/react-community/react-navigation/issues/51 @dmhood
            default:
                newState = RootNavigator.router.getStateForAction(action, state.nav);
                newState.currentRoute = getCurrentRoute(newState).routeName;

                if (newState !== state.nav) {
                    return {
                        ...state,
                        nav: newState
                    };
                }
        }

        return state;
    }
}
