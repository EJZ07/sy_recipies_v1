import 'react-native-gesture-handler'
import React, { useEffect, useState, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import Toast from 'react-native-toast-message'
import { toastConfig } from '../../utils/ShowToast'
import * as Linking from 'expo-linking'
import { LoginNavigator } from './stacks'
import RootStack from './rootstack/RootStack'

export default function App() {
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)

  const prefix = Linking.createURL("/");
  const [title, setTitle] = useState('default title')

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "home",
        Settings: "settings",
      },
    },
  };


  return (
    <>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} linking={linking}>
        {userData?
          <RootStack/>
          :
          <LoginNavigator/>
        }
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  )
}
