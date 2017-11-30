import React from 'react';
import PropTypes from 'prop-types';
import RNFetchBlob from 'react-native-fetch-blob';
import { Icon, Spinner } from 'native-base';
import { View, Platform, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import BaseVideo from './_VideoPlayer';


class VideoLazy extends React.Component {
    static propTypes = {
        ...BaseVideo.propTypes,
        url: PropTypes.string
    };

    static defaultProps = {
        url: undefined
    };

    constructor(props) {
        super(props);
        this.state = {
            vdoPath: null,
            onHold: true,
            loading: false,
        };

        this._loadVdo = this._loadVdo.bind(this);
    }

    componentWillUnmount() {
        RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/vdo`);
    }

    _getVdoLocalPath(url) {
        const identity = url.split('/').pop();
        const path = `${RNFetchBlob.fs.dirs.DocumentDir}/vdo/${identity}`;
        return new Promise((resolve) => {
            if (Platform.OS !== 'ios') {
                resolve(url);
                return;
            }

            RNFetchBlob.fs.exists(path)
                .then((exist) => {
                    if (exist) {
                        resolve(path);
                    } else {
                        RNFetchBlob
                            .config({
                                path,
                            })
                            .fetch('GET', url)
                            .then((res) => {
                                resolve(res.path())
                            })
                    }
                })
        })
    }

    _loadVdo() {
        this.setState({loading: true});

        if (this.props.url) {
            this._getVdoLocalPath(this.props.url).then((path) => {
                this.setState({
                    onHold: false,
                    vdoPath: path
                })
            });

            return;
        }

        this.setState({
            onHold: false,
        })
    }

    render() {
        if (this.state.onHold) {
            return (
                <View style={styles.container}>
                    <View style={[styles.inner, this.props.style]}>
                        <TouchableWithoutFeedback onPress={this._loadVdo}>
                            {(this.state.loading)
                                ? <Spinner color="white" />
                                : <Icon name="play" style={styles.playBtn} />
                            }
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <BaseVideo
                    source={(this.state.vdoPath ? { uri :this.state.vdoPath } : undefined)}
                    disableBack
                    disableVolume
                    {...this.props}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inner: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    playBtn: {
        color: 'white',
        fontSize: 20
    }
});

export default VideoLazy;
