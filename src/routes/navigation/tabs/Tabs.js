import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import { AntDesign } from '@expo/vector-icons';
import { colors } from 'theme'

// stack navigators
import { HomeNavigator, ProfileNavigator, ConnectNavigator } from '../stacks'
import { ModalStacks } from '../stacks/ModalStacks/ModalStacks';
import Create from '../../../scenes/Create';
import Mock from '../../../scenes/Mock';

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
     
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
