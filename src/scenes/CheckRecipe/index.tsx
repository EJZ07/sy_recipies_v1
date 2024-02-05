import React, { useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, Image, useWindowDimensions } from 'react-native'
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
import { follow, unfollow } from '../../utils/firebaseFunctions'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import styles from './styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function CheckRecipe() {
  const route = useRoute()
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height
  const { data } = route.params
  const { userData, followList, setFollowList, getFollowers } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [comments, setComments] = useState([''])
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
      if (follow == data.id) setHasBeenFollowed(true)
    })

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
      <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag" extraHeight={220} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: data.image }} style={{
          width: deviceWidth,
          height: deviceHeight / 1.6,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }} />
        <View style={styles.info}>
          <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 8, alignContent: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
              <Avatar
                size="small"
                rounded

                source={{ uri: data.avatar }}
              />
              <View style={{ flexDirection: "column", marginLeft: 12 }}>
                <Text style={[styles.title, { color: colorScheme.text }]}>{data.name}</Text>
                <Text style={[styles.contents, { color: colorScheme.text }]}>18k followers</Text>
              </View>


            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {
                hasBeenFollowed ? <Button
                  label='Unfollow'
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
            onPress={handleFollow}
          />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', gap: 15, marginBottom: 20 }}>
            <Button
              label='Save'
              size={12}
              textColor={{ fontWeight: "600" }}
              buttonStyle={{ borderRadius: 22, height: 40, flex: 4 }}
              color={colors.gray}
              onPress={handleFollow}
            />
            <View style={styles.share}>
              <FontAwesome5 name="share-alt" size={18} color="black" />
            </View>
          </View>
          <View style={{ backgroundColor: colors.gray, borderTopColor: colors.gray, borderRadius: 12, height: 1 }} />

          <View style={{ flexDirection: "column", marginTop: 20, marginBottom: 20, flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 20}}>
              <Text style={[styles.contents, { color: colorScheme.text }]}>5 comments</Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <AntDesign name="hearto" size={18} color={colorScheme.text} />
                <Text style={[styles.contents, { color: colorScheme.text }]}>140</Text>
              </View>
            </View>
            {
              comments.map((com) => (
                <View style={{ flexDirection: "row", alignItems: "flex-start", width: deviceWidth, paddingRight: 60}}>
                  <Avatar
                    size="small"
                    rounded
                    source={{ uri: data.avatar }}
                  />
                  <View style={{ flexDirection: "column", marginLeft: 12 }}>
                    <Text style={{ color: colorScheme.text, fontSize: 12, paddingBottom: 8 }}>{data.name}</Text>
                    <Text style={[ { color: colorScheme.text }]} numberOfLines={3}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</Text>
                  </View>

                </View>
              ))
            }


          </View>

        </View>
      </KeyboardAwareScrollView>
    </ScreenTemplate>
  )
}
