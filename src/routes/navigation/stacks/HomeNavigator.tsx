import React, { useState, useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { colors, fontSize } from '../../../theme'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { HomeTitleContext } from '../../../context/HomeTitleContext'
import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { lightProps, darkProps } from './navigationProps/navigationProps'
import { createMaterialBottomTabNavigator} from 'react-native-paper/lib/typescript/react-navigation'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import * as Linking from 'expo-linking'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import Home from '../../../scenes/Home'
import FollowerFeed from '../../../scenes/FollowerFeed'
import Detail from '../../../scenes/detail'
import CheckRecipe from '../../../scenes/CheckRecipe'
import External from '../../../scenes/External'
import Allingredients from '../../../scenes/Allingredients'
import Makeit from '../../../scenes/Makeit'

const TopNav = () => {

  


  return (
    <TopTab.Navigator
      initialRouteName="For You"
      screenOptions={{
        tabBarLabelStyle: {
          color: "#FFFFFF"
        },
        tabBarStyle: {
          backgroundColor: "#00000000"
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#FFFFFF"
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF"
      }}
    >
      <TopTab.Screen name="Following" component={FollowerFeed} />
      <TopTab.Screen name="For You" component={Home} />
    </TopTab.Navigator>
  )
}

export const HomeNavigator = () => {
  const Stack = createStackNavigator()
const TopTab = createMaterialTopTabNavigator()

  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const navigationProps = scheme === 'dark' ? darkProps : lightProps
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  const [title, setTitle] = useState('default title')
  


  return (
    <HomeTitleContext.Provider

      value={{
        title,
        setTitle,
      }}

    >
      <HomeTitleContext.Consumer>
        {(ctx) => (
         
            <Stack.Navigator screenOptions={navigationProps}

              options={{

              }}>
              <Stack.Screen
                name="HomeStack"
                component={Home}

                options={() => ({


                  header: () => (
                    <View style={{ alignItems: "center", paddingBottom: 5 }}>
                      <Text style={{ color: "white", textAlign: "center", fontSize: fontSize.large, paddingTop: 50, fontWeight: '500' }}>All</Text>
                      <View style={{ flex: 1, height: 1, backgroundColor: 'white', borderTopColor: "white", width: 25, paddingTop: 1.5, borderRadius: 12 }} />
                    </View>

                  )

                  // headerBackground: () => (<HeaderStyle />),
                })}
              />
              <Stack.Screen
                name="Look"
                component={CheckRecipe}


                options={{
                  headerTransparent: true,
                  headerTitle: '',
                  headerBackTitle: ""

                }}

              />
              <Stack.Screen
                name="SearchIngredient"
                component={External}


                options={{


                  headerTransparent: true,
                  headerTitle: '',
                  headerBackTitle: ""

                }}

              />
              <Stack.Screen
                name="SeeAllIngredients"
                component={Allingredients}
                options={{
                  headerTransparent: true,
                  headerTitle: '',
                  headerBackTitle: ""

                }}

              />
              <Stack.Screen
                name="MakeRecipe"
                component={Makeit}
                options={{


                  headerTitle: '',
                  headerBackTitle: ""

                }}

              />
            </Stack.Navigator>
       
        )
        }
      </HomeTitleContext.Consumer >
    </HomeTitleContext.Provider >

  )
}


const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: colors.lightyellow,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  darkContent: {
    backgroundColor: colors.gray,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.middle,
    marginBottom: 20,
    textAlign: 'center'
  },
  contents: {
    fontSize: fontSize.small,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  send: {
    position: "absolute",
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#3686EF",
    justifyContent: 'center',
    zIndex: 200,

    right: 30,

    shadowColor: "#000000",
    shadowOpacity: 0.3033,
    shadowRadius: 2.5,
    shadowOffset: {
      height: 3,
      width: 1
    },
    elevation: 5,
  },
})
