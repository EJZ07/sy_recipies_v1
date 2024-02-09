import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { storage } from '../../utils/Storage'
import { UserDataContext } from '../../context/UserDataContext'
import { AntDesign } from '@expo/vector-icons';
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import { follow, unfollow } from '../../utils/firebaseFunctions'
import moment from 'moment'
import styles from './styles'
import { Feather } from '@expo/vector-icons'
import { Avatar } from '@rneui/themed';
import TimeAgo from 'react-native-timeago'
export default function Otheruser() {
  const route = useRoute()
  const { data, from } = route.params
  const { userData, followList, setFollowList, getFollowers } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [followings, setFollowings] = useState([])
  const [posts, setPosts] = useState([])
  const [hasBeenFollowed, setHasBeenFollowed] = useState(false)
  const { setTitle } = useContext(HomeTitleContext)
  const date = data?.createdAt?.toDate()
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  const getFollowings = async () => {
    console.log("getComments")
    try {
      const usersRef = await collection(firestore, 'users', data.id, 'following')
      const q = query(usersRef);
      let temp = []
      const querySnapshot = await getDocs(q);

      // console.log("THE SNAPSHOT: ", querySnapshot)
      querySnapshot.forEach((doc) => {
        temp.push(doc.data())
        console.log("Following: ", doc.data())
        // setComments([...comments, ...[doc.data()]])
      });

      setFollowings(temp)


    } catch (e) {
      console.log("Error getting current user : ", e)
    }

  }

  const getPosts = async () => {
    console.log("getposts")
    try {
      const usersRef = await collection(firestore, 'users', data.id, 'posts')
      const q = query(usersRef, orderBy("createdAt", "desc"));
      let temp = []
      const querySnapshot = await getDocs(q);

      // console.log("THE SNAPSHOT: ", querySnapshot)
      querySnapshot.forEach((doc) => {
        temp.push(doc.data())
        console.log("post: ", doc.data())
        // setComments([...comments, ...[doc.data()]])
      });

      setPosts(temp)


    } catch (e) {
      console.log("Error getting current user : ", e)
    }

  }

  useEffect(() => {
    console.log("Get Date: ", date)
    console.log('FOLLOW LIST: ', followList)
    followList.forEach((follow) => {
      if (follow == data.id) setHasBeenFollowed(true)
    })

    getFollowings()
    getPosts()

  }, [])

  useFocusEffect(() => {
    setTitle(data.fullName)
  });

  const handleFollow = () => {
    follow({ userData, data })
    setFollowList([...followList, data.id])
    getFollowers()
    navigation.goBack()
  }

  const handleUnfollow = async () => {

    unfollow({ userData, data })
    setFollowList(followList.filter(follow => follow !== data.id))
    getFollowers()
    navigation.goBack()
  }




  return (
    <ScreenTemplate>
      <View style={{}}>
        <Feather name="chevron-left" size={35} color="white" onPress={() => { navigation.goBack() }} />
      </View>
      <ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>

        <View style={{ alignItems: 'flex-start' }}>
          <Avatar
            size={120}
            rounded
            source={{ uri: data.avatar }}
          />
          <Text style={[styles.field, { color: colorScheme.text }]}>{data.fullName}</Text>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <AntDesign name="clockcircle" size={20} color={colors.gray} />
            <Text style={[styles.title, { color: colors.gray }]}>{data.email}</Text>
          </View>
          <View style={{ alignItems: 'center', flexDirection: "row" }}>
            <Text style={[styles.follow, { color: colorScheme.text }]}>{data.followers} followers</Text>
            <Entypo name="dot-single" size={24} color="white" />
            <Text style={[styles.follow, { color: colorScheme.text }]}>{followings.length} following</Text>
          </View>

          <View style={{ width: '100%' }}>
            {userData.id === data.id ? "" :
              <Button
                label={hasBeenFollowed ? "Unfollow" : 'Follow'}
                textColor={{ fontWeight: "600" }}
                buttonStyle={{ borderRadius: 22, height: 45 }}
                color={hasBeenFollowed ? colors.lightPurple : colors.primary}
                onPress={() => {
                  hasBeenFollowed ?
                    handleUnfollow() :
                    handleFollow()
                }}
              />}

            <Button
              label='Message'
              color={colors.gray}
              textColor={{ fontWeight: "600" }}
              buttonStyle={{ borderRadius: 22, height: 45 }}
              onPress={() => navigation.navigate(
                'DirectMessage',
                {
                  data: data,
                  from: 'Other-User'
                })}
            />
          </View>

          <Text style={[styles.title2, { color: colorScheme.text }]}>Created</Text>
          <View style={{marginBottom: 80}}>
            {

              posts.map((post) => (
                <View style={{ flexDirection: "column" }}>
                  <Image source={{ uri: post.image }} style={{
                    width: 140,
                    height: 100,
                    borderRadius: 20
                  }} />
                  <View key={post.id} style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <Text style={[styles.title, { color: colorScheme.text }]}>{post.title}</Text>
                    <Text style={[styles.title, { color: colors.gray }]}>   <Text style={{ color: colors.gray, fontSize: fontSize.small }}><TimeAgo time={post?.createdAt.toDate()} /></Text></Text>
                  </View>
                </View>

              ))
            }
          </View>


        </View>
      </ScrollView>
    </ScreenTemplate>
  )
}
