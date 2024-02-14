import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, useWindowDimensions, SafeAreaView, Text, TouchableOpacity, } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScreenTemplate from '../../components/ScreenTemplate';
import Livestreamui from '../../components/Livestreamui';
import { usePromiseTracker } from 'react-promise-tracker';
import { StreamCall, StreamVideo, StreamVideoClient, User } from '@stream-io/video-react-native-sdk';
import Viewstreamui from '../../components/Viewstreamui';

const apiKey = "mmhfdzb5evj2"; // the API key can be found in the "Credentials" section
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiTHVtaXlhIiwiaXNzIjoiaHR0cHM6Ly9wcm9udG8uZ2V0c3RyZWFtLmlvIiwic3ViIjoidXNlci9MdW1peWEiLCJpYXQiOjE3MDc3NTc1MTksImV4cCI6MTcwODM2MjMyNH0.Gld7bNaL3WWWnsYieLAzV-LSnu_Dqel0-gL275FnB28"; // the token can be found in the "Credentials" section
const userId = "Lumiya"; // the user id can be found in the "Credentials" section
const callId = "3QfK9u0rrhi"; // the call id can be found in the "Credentials" section

// initialize the user object
const user: User = {
  id: userId,
  name: 'Santhosh',
  image: `https://getstream.io/random_png/?id=${userId}&name=Santhosh`,
};

const myClient = new StreamVideoClient({ apiKey, user, token });
const myCall = myClient.call('livestream', callId);
myCall.join({ create: true });

const ViewStream = () => {
    const route = useRoute();
    const { streamer } = route.params
    const { promiseInProgress } = usePromiseTracker();
    const deviceWidth = useWindowDimensions().width
    const deviceHeight = useWindowDimensions().height

    useEffect(() => {
        console.log('Live screen: ', streamer)
    }, [])

    // // const { url, name } = route.params

    return (
        <StreamVideo client={myClient} language='en'>
            <StreamCall call={myCall}>
                <SafeAreaView style={{ flex: 1 }}>
                    <Viewstreamui />
                    
                </SafeAreaView>
            </StreamCall>
        </StreamVideo>
    )
};

export default ViewStream;

const styles = StyleSheet.create({
    container: {},

});
