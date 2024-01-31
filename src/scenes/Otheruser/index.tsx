import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { storage } from '../../utils/Storage'
import { UserDataContext } from '../../context/UserDataContext'
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { follow, unfollow} from '../../utils/firebaseFunctions'
import moment from 'moment'
import styles from './styles'

export default function Otheruser() {
  const route = useRoute()
  const { data, from } = route.params
  const { userData, followList } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [hasBeenFollowed, setHasBeenFollowed] = useState(false)
  const { setTitle } = useContext(HomeTitleContext)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  useEffect(() => {
    console.log('FOLLOW LIST: ', followList)
    followList.forEach((follow) => {
      if(follow == data.id) setHasBeenFollowed(true)
    })

    loadStorage()
  }, [])

  useFocusEffect(() => {
    setTitle(data.fullName)
  });

  const handleFollow = () => {
    follow({userData, data})
  }

  const handleUnfollow = async () => {
    
      unfollow({userData, data})

  }

  const checkIfFollowed = async () => {
    const followingRef = await collection(firestore, 'users', userData.id, 'following')
    const q = query(followingRef);
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      if(doc.id == data.id) setHasBeenFollowed(true)
    });

  }

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

  return (
    <ScreenTemplate>
      <View style={[styles.container, colorScheme.content]}>
        <Text style={[styles.field, { color: colorScheme.text }]}>View User Profile</Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>{data.email}</Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>from</Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>{from}</Text>
        <Text style={[styles.field, { color: colorScheme.text }]}>Latest save date</Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>{date.date}</Text>
        <View style={{ width: '100%' }}>
          <Button
            label={hasBeenFollowed ? "Unfollow" : 'Follow'}
            color={hasBeenFollowed ? colors.secondary : colors.primary}
            onPress={() => {
              hasBeenFollowed ?
              handleUnfollow() :
              handleFollow()}}
          />
          <Button
            label='Go to Print'
            color={colors.tertiary}
            onPress={() => navigation.navigate('Print')}
          />
        </View>
      </View>
    </ScreenTemplate>
  )
}
