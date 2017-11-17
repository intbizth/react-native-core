// https://github.com/anarchicknight/react-native-communications/blob/master/AKCommunications.js

import {
    Linking,
    Platform,
} from 'react-native';


export const phonecall = function (phoneNumber, prompt = true) {
    if (!isCorrectType('String', phoneNumber)) {
        console.log('the phone number must be provided as a String value');
        return;
    }

    if (!isCorrectType('Boolean', prompt)) {
        console.log('the prompt parameter must be a Boolean');
        return;
    }

    let url;

    if (Platform.OS !== 'android') {
        url = prompt ? 'telprompt:' : 'tel:';
    }
    else {
        url = 'tel:';
    }

    url += phoneNumber;

    LaunchURL(url);
};

const LaunchURL = function (url) {
    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            console.log('Can\'t handle url: ' + url);
        } else {
            Linking.openURL(url)
                .catch(err => {
                    if (url.includes('telprompt')) {
                        // telprompt was cancelled and Linking openURL method sees this as an error
                        // it is not a true error so ignore it to prevent apps crashing
                        // see https://github.com/anarchicknight/react-native-communications/issues/39
                    } else {
                        console.warn('openURL error', err)
                    }
                });
        }
    }).catch(err => console.warn('An unexpected error happened', err));
};

const isCorrectType = function (expected, actual) {
    return Object.prototype.toString.call(actual).slice(8, -1) === expected;
};
