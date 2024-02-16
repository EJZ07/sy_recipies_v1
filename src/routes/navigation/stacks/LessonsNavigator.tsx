import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'

import Profile from '../../../scenes/Profile'
import Edit from '../../../scenes/Edit'
import Live from '../../../scenes/Live'
import Lessons from '../../../scenes/Lessons'
import View from '../../../scenes/ViewStream'
import ViewStream from '../../../scenes/ViewStream'

const Stack = createStackNavigator()
const RootStack = createStackNavigator()

export const LessonsNavigator = () => {
  const { scheme } = useContext(ColorSchemeContext)
  const navigationProps = scheme === 'dark' ? darkProps:lightProps
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="Lessons"
          component={Lessons}
          options={({ navigation }) => ({
            headerBackground: scheme === 'dark' ? null: () => <HeaderStyle />,
          })}
        />
         <Stack.Screen
          name="LiveStream"
          component={ViewStream}
          options={({ navigation }) => ({
            headerBackground: scheme === 'dark' ? null: () => <HeaderStyle />,
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  )
}