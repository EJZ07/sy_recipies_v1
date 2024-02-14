import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, Image, useWindowDimensions, TextInput, Pressable, Share, ScrollView, TouchableOpacity } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import * as Linking from "expo-linking"
import { UserDataContext } from '../../context/UserDataContext'
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc, where, orderBy } from 'firebase/firestore';
import { follow, save, unfollow, unsave, like, unLike } from '../../utils/firebaseFunctions'
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import styles from './styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FlagContext } from '../../context/FlagContext'
import Comments from '../../components/Comments'
import CreateComment from '../../components/Createcomment'
import { FlatList } from 'react-native-gesture-handler'
import Ingredientcheck from '../../components/Ingredientcheck'
import navigation from '../../routes/navigation'

export default function CheckRecipe() {
  const route = useRoute()
  const navigation = useNavigation()
  const url = Linking.createURL("/");
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height
  const { data, id } = route.params
  const { userData, followList, setFollowList, getFollowers,
    savedList, setSavedList, likedList, setLikedList,
    getSaved, getLiked } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)

  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [saved, setSaved] = useState(false)
  const [comments, setComments] = useState([{}])
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [hasBeenFollowed, setHasBeenFollowed] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [likes, setLikes] = useState(data?.likeCount)
  const { setTitle } = useContext(HomeTitleContext)

  const [rows, setRows] = useState(data?.ingredients.reduce(function (rows, key, index) {
    return (index % 2 == 0 ? rows.push([key])
      : rows[rows.length - 1].push(key)) && rows;
  }, []))

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
    setLikes(likes + 1)
    setLiked(true)
  }

  const handleUnLike = async () => {
    unLike({ userData, data, id })
    setLikedList(likedList.filter(like => like !== id))
    setLikes(likes - 1)
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

  const getComments = async () => {
    console.log("getComments")
    try {
      const usersRef = await collection(firestore, 'posts', id, 'comments')
      const q = query(usersRef, orderBy("createdAt", "desc"));
      let temp = []
      const querySnapshot = await getDocs(q);

      // console.log("THE SNAPSHOT: ", querySnapshot)
      querySnapshot.forEach((doc) => {
        temp.push(doc.data())
        // setComments([...comments, ...[doc.data()]])
      });

      setComments(temp)


    } catch (e) {
      console.log("Error getting current user : ", e)
    }

  }

  useEffect(() => {
    console.log("Post data: ", data)
    getCurrentUser()
    getComments()
    console.log(url)
  }, [rerender])


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
    console.log("holl")
    setTitle(data.fullName)
  });

  return (
    <ScreenTemplate>
      <CreateComment isVisible={showCreate} setIsVisible={setShowCreate} id={id} />
      <Comments isVisible={showComments} setIsVisible={setShowComments} id={id} numberOfLikes={likes} comments={comments} />

      <ScrollView bounces={false} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => {
          navigation.navigate(
            'MakeRecipe',
            {
              data: data,
              id: id
            })
        }}>
          <Image source={{ uri: data.image }} style={{
            width: deviceWidth,
            height: deviceHeight / 1.6,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }} />
        </TouchableOpacity>
        <View style={styles.info}>
          <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 15, alignContent: "center" }}>
            <Pressable style={{ flexDirection: "row", alignItems: "center", }} onPress={() => {
              navigation.navigate('ModalStacks', {
                screen: 'Other-User',
                params: {
                  data: currentUser,
                  from: 'Follow screen'
                }
              })
            }}>
              <Avatar
                size="small"
                rounded
                onPress={() => {
                  navigation.navigate('ModalStacks', {
                    screen: 'Other-User',
                    params: {
                      data: currentUser,
                      from: 'Follow screen'
                    }
                  })
                }}
                source={{ uri: data.avatar }}
              />
              <View style={{ flexDirection: "column", marginLeft: 12 }}>
                <Text style={[styles.title, { color: colorScheme.text }]}>{data.name}</Text>
                {currentUser?.followers == 0 ? <Text style={[styles.contents, { color: colorScheme.text }]}>{currentUser.followers} follower{currentUser?.followers == 1 ? "" : "s"}</Text> :
                  <Text style={[styles.contents, { color: colorScheme.text }]}>{currentUser.followers} follower{currentUser?.followers == 1 ? "" : "s"}</Text>}

              </View>


            </Pressable>
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
          <View style={{
                flexDirection: 'row',
                width: "100%",
                flexWrap: "wrap",
                gap: 10,
                rowGap: 8,
            }}>
            {data.tags?.map((tag) => (
                <TagItem key={tag.id} tag={tag}/>
            ))}      
          </View>
          <Text style={[styles.name, { color: colorScheme.text, }]}>{data.title}</Text>
          <Pressable style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 15 }}
            onPress={() => {
              navigation.navigate(
                'SeeAllIngredients',
                {
                  list: data?.ingredients,
                  id: id
                })
            }}>
            <Text style={[styles.contents, { color: colorScheme.text }]}>See All Ingredients</Text>
            <Feather name="chevron-right" size={30} color="white" onPress={() => {
              navigation.navigate(
                'SeeAllIngredients',
                {
                  name: data?.ingredients,
                  id: id
                })
            }} />
          </Pressable>
          <ScrollView style={{ paddingTop: 5, overflow: "scroll", maxHeight: fontSize.large * 6 }}>
            {
              rows.map((ing, index) => (
                <View style={{ flexDirection: "row" }}>
                  <Ingredientcheck key={index + 1} ingredient={ing[0]} id={id} />
                  {ing[1] ? <Ingredientcheck key={index + 2} ingredient={ing[1]} id={id} /> : ""}

                </View>
              ))
            }
          </ScrollView>
          {/* <FlatList
            numColumns={2}
            style={[styles.ingredients]}
            data={data?.ingredients}
            keyExtractor={(item) => item + (Math.random() * 9999)}
            renderItem={({ index, item }) => }
            showsVerticalScrollIndicator={false}

          /> */}
          <Button
            label='Make It'
            size={12}
            textColor={{ color: "black", fontWeight: "600" }}
            buttonStyle={{ borderRadius: 22, height: 40 }}
            color={colors.lightGrayPurple}
            onPress={() => {
              navigation.navigate(
                'MakeRecipe',
                {
                  data: data,
                  id: id
                })
            }}
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
              <Pressable onPress={() => setShowComments(true)}>
                <Text style={[styles.contents, { color: colorScheme.text }]}>{comments.length} comment{comments.length == 1 ? "" : "s"}</Text>
              </Pressable>
              <View style={{ flexDirection: "row", gap: 5 }}>
                {
                  liked ? <AntDesign name="heart" size={20} color={colors.pink} onPress={handleUnLike} /> : <AntDesign name="hearto" size={20} color={colorScheme.text} onPress={handleLike} />
                }

                <Text style={[styles.contents, { color: colorScheme.text }]}>{likes}</Text>
              </View>
            </View>
            <Pressable style={{ overflow: "scroll" }} onPress={() => setShowComments(true)}>
              {
                comments.slice(0, 2).map((com) => (
                  <View style={{ marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", width: deviceWidth, paddingRight: 60 }}>
                      <Avatar
                        size="small"
                        rounded
                        source={{ uri: com?.avatar }}
                      />
                      <View style={{ flexDirection: "column", marginLeft: 12 }}>
                        <Text style={{ color: colorScheme.text, fontSize: 12, paddingBottom: 8 }}>{com?.name}</Text>
                        <Text style={[{ color: colorScheme.text }]} numberOfLines={3}>{com?.text}</Text>
                      </View>

                    </View>
                  </View>
                ))
              }
              {comments.length > 2 ? <Text style={[{ color: colorScheme.text }]}>See More...</Text> : ""}
            </Pressable>
            <View style={{ paddingVertical: 20, paddingBottom: 0 }}>
              <Pressable style={{ borderColor: colorScheme.text, borderWidth: 1, borderRadius: 28, padding: 10, flexDirection: "row", gap: 12, alignItems: "center" }} onPress={() => { setShowCreate(true) }}>
                <Avatar
                  size="small"
                  rounded

                  source={{ uri: userData.avatar }}
                />
                <Text style={{ color: colors.gray, fontSize: 16, fontWeight: '500' }}>Tell Them What you Think</Text>
              </Pressable>
            </View>


          </View>

        </View>
      </ScrollView>
    </ScreenTemplate>
  )
}
