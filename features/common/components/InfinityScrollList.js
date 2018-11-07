import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet } from 'react-native';
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
            viewableKeys: []
        };

        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderItem = this._renderItem.bind(this);
        // IOS Buggy. see: https://github.com/facebook/react-native/issues/14015
        this._handleLoadMore = debounce(this._handleLoadMore.bind(this), 700);

        // https://stackoverflow.com/questions/24306290/lodash-debounce-not-working-in-anonymous-function
        this.__onViewableItemsChanged = debounce(this.__onViewableItemsChanged.bind(this), 500);
    }

    _handleLoadMore() {
        if (this.props.loadingMore || this.props.refreshing) {
            return;
        }

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
        if (!this._ref) {
            return;
        }

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
            <List ref={(ref) => this._ref = ref} style={styles.list}>
                <FlatList
                    onEndReachedThreshold={0.8}
                    keyExtractor={(item) => item.id.toString()}
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

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
});

export default InfinityScrollList;
