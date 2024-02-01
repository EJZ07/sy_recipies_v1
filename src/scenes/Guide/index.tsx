import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation, StackActions } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { storage } from '../../utils/Storage'
import { UserDataContext } from '../../context/UserDataContext'
import { FlagContext } from '../../context/FlagContext'
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { addPost, follow, unfollow } from '../../utils/firebaseFunctions'
import { Feather } from '@expo/vector-icons';
import moment from 'moment'
import styles from './styles'
import Modal from 'react-native-modal'

type ModalProps = {
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
};


export default function Guide() {
  const route = useRoute()
  const popAction = StackActions.pop(1);
  const { userData, followList, setFollowList, getFollowers } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  useEffect(() => {
    loadStorage()
  }, [])


  const loadStorage = async () => {
    try {
      const result = await storage.load({ key: 'date' })
      setDate(result)
    } catch (e) {
      const result = { date: 'no data' }
      setDate(result)
    }
  }

  const saveStorage = () => {
    const today = moment().toString()
    storage.save({
      key: 'date',
      data: {
        'date': today
      }
    })
  }

  const onSavePress = () => {
    saveStorage()
    loadStorage()
  }

  const handlePost = () => {
    const data = {
      id: userData.id,
      name: userData.fullName,
      avatar: userData.avatar,
      text: text,
      createdAt: new Date()
    }
    addPost({ userData, data })
    setRerender(!rerender)
    navigation.goBack()
  }

  return (
  
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
      
        <View style={[styles.container, colorScheme.content]}>
        <View style={{paddingVertical: 10, paddingTop: 19}}>
          <Feather name="chevron-left" size={30} color="white" onPress={() => {
            navigation.goBack()
            } } />
        </View>
          <TextInput
            placeholder={`Set the step by step instructions`}
            editable
            multiline
            numberOfLines={4}
            maxLength={40}
            onChangeText={text => setText(text)}
            value={text}
            style={{ padding: 10, color: colorScheme.text, fontSize: 25 }}
          />
          <View style={{ flex: 1, marginLeft: 10 }} >
            <Button
              label='Next'
              color={colors.lightPurple}
              onPress={() => alert("POSTED")}
              style={{ marginHorizontal: 20, marginLeft: 10 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

  )
}
