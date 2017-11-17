import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { Spinner, List } from "native-base";
import includes from "lodash/includes";
import debounce from "lodash/debounce";


class InfinityScrollList extends React.Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        renderItem: PropTypes.func.isRequired,
        onLoadMore: PropTypes.func.isRequired,
        loadingMore: PropTypes.bool.isRequired,
        onRefresh: PropTypes.func.isRequired,
        refreshing: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            onEndReachedCalledDuringMomentum: true, // IOS Buggy. see: https://github.com/facebook/react-native/issues/14015
            viewableKeys: []
        };

        this._handleLoadMore = this._handleLoadMore.bind(this);
        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderItem = this._renderItem.bind(this);

        // https://stackoverflow.com/questions/24306290/lodash-debounce-not-working-in-anonymous-function
        this.__onViewableItemsChanged = debounce(this.__onViewableItemsChanged.bind(this), 500);
    }

    _handleLoadMore() {
        const {refreshing, loadingMore, onLoadMore} = this.props;
        if (this.state.onEndReachedCalledDuringMomentum || loadingMore || refreshing) {
            return false;
        }

        onLoadMore();
    }

    _renderItem(e) {
        return this.props.renderItem(e, {
            inView: includes(this.state.viewableKeys, e.item.id)
        });
    }

    // Changing `onViewableItemsChanged` on the fly is not supported
    _onViewableItemsChanged(e) {
        if (!this._ref) {
            return;
        }

        this.__onViewableItemsChanged(e);
    }

    __onViewableItemsChanged({viewableItems}) {
        const viewableKeys = this.state.viewableKeys;
        viewableItems.map((v) => {
            if (includes(viewableKeys, v.id)) {
                return;
            }

            viewableKeys.push(v.key);
        });

        this.setState({
            viewableKeys
        });
    }

    render() {
        const {refreshing, loadingMore, data, onRefresh} = this.props;
        return (
            <List ref={(ref) => this._ref = ref}>
                <FlatList
                    data={data}
                    extraData={this.state}
                    keyExtractor={(item) => item.id}
                    renderItem={this._renderItem}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onEndReached={this._handleLoadMore}
                    onEndReachedThreshold={0}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    onMomentumScrollBegin={() => this.setState({onEndReachedCalledDuringMomentum: false})}
                    ListFooterComponent={loadingMore && <Spinner color="black" />}
                />
            </List>
        )
    }
}

export default InfinityScrollList;
