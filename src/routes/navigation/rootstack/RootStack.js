import React, { useState, useContext, useEffect } from "react";
import { Platform} from "react-native";
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import TabNavigator from "../tabs/Tabs";
import { ModalStacks } from "../stacks/ModalStacks/ModalStacks";
import * as Notifications from 'expo-notifications'
import { firestore } from "../../../firebase/config";
import { setDoc, doc } from 'firebase/firestore';
import { UserDataContext } from "../../../context/UserDataContext";
import * as Device from 'expo-device';
import { expoProjectId } from "../../../config";
import * as Linking from "expo-linking";
import Create from "../../../scenes/Create";

import { CreateNavigator } from "../stacks/CreateNavigator";
import { FlagContext } from "../../../context/FlagContext";

const Stack = createStackNavigator()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootStack() {
  const { userData, getFollowers, getLiked, getSaved} = useContext(UserDataContext)
  const {setDeepLink} = useContext(FlagContext)
  const isIos = Platform.OS === 'ios'

  const [data, setData] = useState(null)

  const handleDeepLink = (event) => {
 
    let data = Linking.useURL()
    setDeepLink(data)

    console.log("Deep Link: ", data)
  }

  useEffect(() => {

    (async () => {
      const isDevice = Device.isDevice
      if(!isDevice) return
      console.log('get push token')
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: expoProjectId
      });
      const tokensRef = doc(firestore, 'tokens', userData.id);
      await setDoc(tokensRef, {
        token: token.data,
        id: userData.id
      })
    })();

    getFollowers()
    getLiked()
    getSaved()
  }, [userData])

  useEffect(() => {
    console.log("Handling deep link")
    Linking.addEventListener(
      'url',
      handleDeepLink
    )
    return () => {
      Linking.createURL(
        'url'
      )
    }
  }, []);

  

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='HomeRoot'
        component={TabNavigator}
      />
      <Stack.Screen 
      name="Create"
      component={CreateNavigator} />
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
          gestureEnabled: isIos
        }}
      >
        <Stack.Screen
          name='ModalStacks'
          component={ModalStacks}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}