export default (entity, key) => {
    return (
        (state = {}, action) => {
            switch (action.type) {
                case entity.SUBMIT_SUCCESS:
                    return {
                        ...state,
                        [key]: action.data,
                    };
                default:
                    return state;
            }
        }
    );
};
