import React, { useEffect, useContext, useState, useCallback } from 'react'
import { Text, View, StyleSheet, RefreshControl, Image, Pressable } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { colors, fontSize } from "../../theme"
import { firestore, } from '../../firebase/config';
import { getFirestore } from 'firebase/firestore'
import { doc, onSnapshot, collection, query, getDocs } from 'firebase/firestore';
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { useNavigation } from '@react-navigation/native'
import styles from "./styles"
import { Snackbar } from 'react-native-paper'
import { FlatList } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons';

export default function Follow() {
  const navigation = useNavigation()
  const db = getFirestore();

  const { userData, followList } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [userList, setUserList] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUsers();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText
  }

  const UserComp = ({ user }) => {
    return (
      <Pressable style={styles.container2} onPress={() => {
        navigation.navigate('ModalStacks', {
          screen: 'Other-User',
          params: {
            data: user,
            from: 'Follow screen'
          }
        })
      }}>
        <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: 'center', }}>
          <View style={{ flexDirection: "row",  }}>
            <Image source={{ uri: user.avatar }} style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginRight: 10
            }} />
            <View>
              <Text style={[styles.item, { color: colorScheme.text }]}>{user.fullName}</Text>
              <Text style={[styles.item2, { color: colorScheme.text }]}>{user.email}</Text>
            </View>

          </View>
          {user.id === userData.id ? "" : <AntDesign name={followList.includes(user.id) ? "star" : "staro"} size={24} color={followList.includes(user.id) ? colors.lightyellow : colors.white} />}

        </View>


      </Pressable>
    )
  }

  const getUsers = async () => {
    const usersRef = await collection(firestore, 'users')
    const q = query(usersRef);
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      temp.push(doc.data())
      // setUserList([...userList, ...[doc.data()]])
    });

    setUserList(temp)
  }

  const getFollowings = async () => {

  }

  useEffect(() => {

    getUsers()
    // onSnapshot(usersRef, (querySnapshot) => {
    //   const userData = querySnapshot.data()
    //   console.log("The users Data: ", userData)
    //   // setUserList(userData)
    // })
  }, [])

  return (
    <ScreenTemplate>
      <View style={[styles.container]}>
        <View style={{ width: '100%', }}>

          <FlatList
            style={{ marginBottom: 30, }}
            data={userList}
            renderItem={({ item }) => <UserComp user={item} />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }

          />
          <View style={{ flex: 1, justifyContent: 'center', paddingTop: 20 }}>
            <Button
              label='Open Modal'
              color={colors.tertiary}
              style={{ flex: 1, }}
              onPress={() => {
                navigation.navigate('ModalStacks', {
                  screen: 'Post',
                  params: {
                    data: userData,
                    from: 'Follow screen'
                  }
                })
              }}
            />
          </View>
        </View>
      </View>
    </ScreenTemplate>
  )
}

