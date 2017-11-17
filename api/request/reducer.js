export default (entity, key) => {
    return (state = {}, action) => {
        switch (action.type) {
            case entity.SUCCESS:
                return {
                    ...state,
                    [key]: action.data,
                };
            default:
                return state;
        }
    }
};
