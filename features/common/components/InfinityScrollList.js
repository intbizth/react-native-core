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
            onEndReachedCalledDuringMomentum: true, // IOS Buggy. see: https://github.com/facebook/react-native/issues/14015
            viewableKeys: []
        };

        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderItem = this._renderItem.bind(this);

        // https://stackoverflow.com/questions/24306290/lodash-debounce-not-working-in-anonymous-function
        this.__onViewableItemsChanged = debounce(this.__onViewableItemsChanged.bind(this), 500);
        this._handleLoadMore = this._handleLoadMore.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loadingMore) {
            return;
        }

        // Prevent call twice loadmore when before calling loadmore success
        setTimeout(() => {
            if (!this._ref) {
                return;
            }

            this.setState({
                onEndReachedCalledDuringMomentum: false
            })
        }, 1500)
    }

    _handleLoadMore() {
        if (this.state.onEndReachedCalledDuringMomentum || this.props.loadingMore || this.props.refreshing) {
            return;
        }

        this.setState({
            onEndReachedCalledDuringMomentum: true
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
                    onEndReachedThreshold={1}
                    keyExtractor={(item) => item.id}
                    {...this.props}
                    onEndReached={this._handleLoadMore}
                    extraData={this.state}
                    ListFooterComponent={this.props.loadingMore && <Spinner color="black" />}
                    renderItem={this._renderItem}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    onMomentumScrollBegin={() => this.setState({onEndReachedCalledDuringMomentum: false})}
                />
            </List>
        )
    }
}

export default InfinityScrollList;
