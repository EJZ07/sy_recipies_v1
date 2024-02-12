import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { usePromiseTracker } from 'react-promise-tracker';
import ScreenTemplate from '../../components/ScreenTemplate';

interface componentNameProps {
    url: string;
}

const External = () => {
    const route = useRoute();
    const { promiseInProgress } = usePromiseTracker();
    const deviceWidth = useWindowDimensions().width
    const deviceHeight = useWindowDimensions().height

    const { url, name } = route.params
    useEffect(() => {
        console.log("URL: ", url)
    }, [])
    return (

        // promiseInProgress ? <View style={{ position: "absolute", zIndex: 200, left: deviceWidth / 2.1, top: deviceHeight / 2.8 }}><ActivityIndicator  color="black" /></View> : 
        <ScreenTemplate>
            <WebView
                style={{ zIndex: 210 }}
                source={{ uri: `https://www.google.com/search?q=${name}+ingredient` }}
            />
        </ScreenTemplate>


    );
};

export default External;

const styles = StyleSheet.create({
    container: {},

});
