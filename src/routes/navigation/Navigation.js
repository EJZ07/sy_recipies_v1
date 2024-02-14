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
  const [title, setTitle] = useState('default title')
  // const prefix = Linking.createURL("/")
  // const linking = {
  //   prefixes: [prefix],
  //   config: {
  //     screens: {
  //       RootStack: "HomeStack",
  //       Look: "Look",
  //       Profile: "ProfileTab",
  //       LoginNavigator: "Login"
  //     }
  //   }
  // };

  // useEffect(()=>{
  //   console.log("Deep Link: ", prefix)
  // }, [])

  return (
    <>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} >
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
