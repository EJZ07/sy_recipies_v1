import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import { AntDesign } from '@expo/vector-icons';
import { colors } from 'theme'
import * as Linking from 'expo-linking'
// stack navigators
import { HomeNavigator, ProfileNavigator, ConnectNavigator } from '../stacks'
import { LessonsNavigator } from '../stacks/LessonsNavigator';
import { ModalStacks } from '../stacks/ModalStacks/ModalStacks';
import Create from '../../../scenes/Create';
import Mock from '../../../scenes/Mock';
import Lessons from '../../../scenes/Lessons';

const Tab = createBottomTabNavigator()
const prefix = Linking.createURL('/')

const TabNavigator = () => {

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "HomeStack",
        Look: "Look",
        Profile: "ProfileTab"
      }
    }
  };
  return (
    <Tab.Navigator
      linking={linking}
      defaultScreenOptions={{
        headerShown: false,
        headerTransparent: true
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.lightPurple,
        tabBarInactiveTintColor: colors.gray,
      })}
      initialRouteName="Home"
      swipeEnabled={false}
    >
      <Tab.Screen
        name="Home"
        tabBarLabel="R"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontIcon
              name="home"
              color={color}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        name="StreamTab"

        component={LessonsNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="videocamera" size={24} color={color} />
          ),
        }}
       
      />
      <Tab.Screen
        name="ConnectTab"

        component={Mock}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="plussquareo" size={28} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate("Create")
          },
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontIcon
              name="user"
              color={color}
              size={20}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
