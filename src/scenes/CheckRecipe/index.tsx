import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, Image, useWindowDimensions, TextInput, Pressable, Share } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import * as Linking from "expo-linking"
import { UserDataContext } from '../../context/UserDataContext'
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc, where } from 'firebase/firestore';
import { follow, save, unfollow, unsave, like, unLike } from '../../utils/firebaseFunctions'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import styles from './styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FlagContext } from '../../context/FlagContext'

export default function CheckRecipe() {
  const route = useRoute()
  const url = Linking.createURL("/ProfileTab");
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height
  const { data, id } = route.params
  const { userData, followList, setFollowList, getFollowers,
    savedList, setSavedList, likedList, setLikedList,
    getSaved, getLiked } = useContext(UserDataContext)

  const { deepLink } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [saved, setSaved] = useState(false)
  const [comments, setComments] = useState([''])
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [hasBeenFollowed, setHasBeenFollowed] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const { setTitle } = useContext(HomeTitleContext)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  const handleFollow = () => {
    follow({ userData, data })
    setFollowList([...followList, data.id])
    setHasBeenFollowed(true)

  }

  const handleUnfollow = async () => {

    unfollow({ userData, data })
    setFollowList(followList.filter(follow => follow !== data.id))

    setHasBeenFollowed(false)
  }

  const handleSave = async () => {
    save({ userData, data, id })
    setSavedList([...savedList, id])

    setSaved(true)
  }

  const handleUnsave = async () => {
    unsave({ userData, data, id })
    setSavedList(likedList.filter(save => save !== id))

    setSaved(false)
  }

  const handleLike = async () => {
    like({ userData, data, id })
    setLikedList([...likedList, id])

    setLiked(true)
  }

  const handleUnLike = async () => {
    unLike({ userData, data, id })
    setLikedList(likedList.filter(like => like !== id))
    setLiked(false)
  }

  const handleShare = async () => {

    Share.share({
      message:
        `Your message. ${url}`,
    })
  


}


const getCurrentUser = async () => {
  console.log("current user")
  try {
    const usersRef = await collection(firestore, 'users')
    const q = query(usersRef, where("id", "==", data.id));
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    querySnapshot.forEach((doc) => {
      console.log("Current User: ", doc.data())
      setCurrentUser(doc.data())
      // setUserList([...userList, ...[doc.data()]])
    });


  } catch (e) {
    console.log("Error getting current user : ", e)
  }

}

useEffect(() => {
  getCurrentUser()


  console.log(url)
}, [])


useEffect(() => {
  console.log('Liked List : ', likedList)
  console.log("data: ", data)

  followList.forEach((follow) => {
    if (follow == data.id) setHasBeenFollowed(true)
  })

  savedList.forEach((save) => {
    console.log("SAVE: ", save)
    if (save == id) setSaved(true)
  })

  likedList.forEach((like) => {
    if (like == id) setLiked(true)
  })

}, [])

useFocusEffect(() => {
  setTitle(data.fullName)
});


return (
  <ScreenTemplate>
    <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
      <Image source={{ uri: data.image }} style={{
        width: deviceWidth,
        height: deviceHeight / 1.6,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      }} />
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 15, alignContent: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <Avatar
              size="small"
              rounded

              source={{ uri: data.avatar }}
            />
            <View style={{ flexDirection: "column", marginLeft: 12 }}>
              <Text style={[styles.title, { color: colorScheme.text }]}>{data.name}</Text>
              {currentUser?.followers == 0 ? <Text style={[styles.contents, { color: colorScheme.text }]}>{currentUser.followers} follower{currentUser?.followers == 1 ? "" : "s"}</Text> :
                <Text style={[styles.contents, { color: colorScheme.text }]}>{currentUser.followers} follower{currentUser?.followers == 1 ? "" : "s"}</Text>}

            </View>


          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {
              hasBeenFollowed ? <Button
                label='Unfollow'
                textColor={{ fontWeight: "600" }}
                buttonStyle={{ borderRadius: 22, height: 34 }}
                color={colors.lightPurple}
                onPress={handleUnfollow}
              /> : <Button
                label='Follow'
                size={12}
                textColor={{ fontWeight: "600" }}
                buttonStyle={{ borderRadius: 22, height: 34 }}
                color={colors.gray}
                onPress={handleFollow}
              />
            }
          </View>
        </View>
        <Text style={[styles.name, { color: colorScheme.text, }]}>{data.title}</Text>
        <Button
          label='Make It'
          size={12}
          textColor={{ color: "black", fontWeight: "600" }}
          buttonStyle={{ borderRadius: 22, height: 40 }}
          color={colors.lightGrayPurple}
          onPress={() => alert("Hello")}
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', gap: 15, marginBottom: 20 }}>
          {
            saved ? <Button
              label='Saved'
              size={12}
              textColor={{ fontWeight: "600" }}
              buttonStyle={{ borderRadius: 22, height: 40, flex: 4 }}
              color={colors.tertiary}
              onPress={() => handleUnsave()}
            /> : <Button
              label='Save'
              size={12}
              textColor={{ fontWeight: "600" }}
              buttonStyle={{ borderRadius: 22, height: 40, flex: 4 }}
              color={colors.gray}
              onPress={() => handleSave()}
            />
          }

          <Pressable style={styles.share} onPress={handleShare}>
            <FontAwesome5 name="share-alt" size={18} color="black" />
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.gray, borderTopColor: colors.gray, borderRadius: 12, height: 1 }} />

        <View style={{ flexDirection: "column", marginTop: 20, marginBottom: 20, flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 20 }}>
            <Text style={[styles.contents, { color: colorScheme.text }]}>5 comments</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {
                liked ? <AntDesign name="heart" size={20} color={colors.pink} onPress={handleUnLike} /> : <AntDesign name="hearto" size={20} color={colorScheme.text} onPress={handleLike} />
              }

              <Text style={[styles.contents, { color: colorScheme.text }]}>140</Text>
            </View>
          </View>
          {
            comments.map((com) => (
              <View style={{ flexDirection: "row", alignItems: "flex-start", width: deviceWidth, paddingRight: 60 }}>
                <Avatar
                  size="small"
                  rounded
                  source={{ uri: data.avatar }}
                />
                <View style={{ flexDirection: "column", marginLeft: 12 }}>
                  <Text style={{ color: colorScheme.text, fontSize: 12, paddingBottom: 8 }}>{data.name}</Text>
                  <Text style={[{ color: colorScheme.text }]} numberOfLines={3}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</Text>
                </View>

              </View>
            ))
          }
          <View style={{ paddingVertical: 30, paddingBottom: 0 }}>
            <View style={{ borderColor: colorScheme.text, borderWidth: 1, borderRadius: 28, padding: 10, flexDirection: "row", gap: 12 }}>
              <Avatar
                size="small"
                rounded

                source={{ uri: userData.avatar }}
              />
              <TextInput
                placeholder={`Tell them what you think!`}
                placeholderTextColor={colors.gray}
                editable

                numberOfLines={1}
                maxLength={40}
                onChangeText={text => setComment(text)}
                value={comment}
                style={{ color: colorScheme.text, fontSize: 18, paddingBottom: 5 }}
              />
            </View>
          </View>


        </View>

      </View>
    </KeyboardAwareScrollView>
  </ScreenTemplate>
)
}
