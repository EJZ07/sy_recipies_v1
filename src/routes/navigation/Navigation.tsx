import 'react-native-gesture-handler'
import React, { useEffect, useState, useContext } from 'react'
import { Platform } from "react-native";
import { NavigationContainer,  } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import Toast from 'react-native-toast-message'
import { toastConfig } from '../../utils/ShowToast'
import * as Linking from 'expo-linking'
import { LoginNavigator } from './stacks'
import { firestore } from "../../firebase/config";
import { setDoc, doc } from 'firebase/firestore';
import * as Device from 'expo-device';
import { expoProjectId } from "../../config";
import { lightProps, darkProps } from './stacks/navigationProps/navigationProps';
import TabNavigator from "./tabs/Tabs";
import { ModalStacks } from "./stacks/ModalStacks/ModalStacks";
import Create from "../../scenes/Create";
import { CreateNavigator } from "./stacks/CreateNavigator";
import { FlagContext } from "../../context/FlagContext";

export default function App() {
  const { scheme } = useContext(ColorSchemeContext)
  const Stack = createStackNavigator()
  const [title, setTitle] = useState('default title')
  const { userData, getFollowers, getLiked, getSaved } = useContext(UserDataContext)
  const isDark = scheme === 'dark'
  const navigationProps = scheme === 'dark' ? darkProps : lightProps
  const isIos = Platform.OS === 'ios'

  const [data, setData] = useState(null)

  const prefix = Linking.createURL('/')
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {

        HomeRoot: {
          screens: {
            Home: {
              screens: {
                HomeStack: "",
                Look: {
                  path: "look/:id",
                  parse: {
                    id: (id) => `${id}`,
       
                  },
                  stringify: {
                    id: (id) => id.replace(/look-/g, ''),
             
                  },
                },
                ProfileTab: "profile"
              }
            }

          }
        }
      }

    }
  };

  useEffect(() => {

    (async () => {
      const isDevice = Device.isDevice
      if (!isDevice) return
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

  return (
    <>
      <NavigationContainer linking={linking} theme={scheme === 'dark' ? DarkTheme : DefaultTheme} >
        {userData ?
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
          :
          <LoginNavigator />
        }
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  )
}
