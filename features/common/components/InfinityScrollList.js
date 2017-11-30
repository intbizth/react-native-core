import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { Spinner, List } from "native-base";
import includes from "lodash/includes";
import debounce from "lodash/debounce";


class InfinityScrollList extends React.Component {
    static propTypes = {
        ...FlatList.propTypes,
        onLoadMore: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            notAllowLoadingMore: false, // IOS Buggy. see: https://github.com/facebook/react-native/issues/14015
            viewableKeys: []
        };

        this._handleLoadMore = this._handleLoadMore.bind(this);
        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderItem = this._renderItem.bind(this);

        // https://stackoverflow.com/questions/24306290/lodash-debounce-not-working-in-anonymous-function
        this.__onViewableItemsChanged = debounce(this.__onViewableItemsChanged.bind(this), 500);
        this._allowLoadingMore = debounce(this._allowLoadingMore.bind(this), 1000);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loadingMore) {
            return;
        }

        this._allowLoadingMore();
    }

    _allowLoadingMore() {
        if (!this._ref) {
            return;
        }

        this.setState({
            notAllowLoadingMore: false
        })
    }

    _handleLoadMore() {
        if (this.state.notAllowLoadingMore || this.props.refreshing) {
            return;
        }

        this.setState({
            notAllowLoadingMore: true
        });
        this.props.onLoadMore();
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
        return (
            <List ref={(ref) => this._ref = ref}>
                <FlatList
                    onEndReachedThreshold={0.8}
                    keyExtractor={(item) => item.id}
                    {...this.props}
                    onEndReached={this._handleLoadMore}
                    extraData={this.state}
                    ListFooterComponent={this.props.loadingMore && <Spinner color="black" />}
                    renderItem={this._renderItem}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                />
            </List>
        )
    }
}

export default InfinityScrollList;
