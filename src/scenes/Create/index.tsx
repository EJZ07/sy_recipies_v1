import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Dimensions, Image, ScrollView, Touchable } from 'react-native'
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
import { Entypo, Feather } from '@expo/vector-icons';
import moment from 'moment'
import styles from './styles'
import * as ImagePicker from 'expo-image-picker';
import { Skeleton } from '@rneui/base'
import { TouchableOpacity } from 'react-native-gesture-handler'

type ModalProps = {
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
};


export default function Create() {
  const route = useRoute()
  const popAction = StackActions.pop(1);
  const { userData, selection, setSelection } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [image, setImage] = useState(selection.image)
  const [text, setText] = useState(selection.title)
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

  const handleSave = () => {
    setSelection({ ...selection, title: text })
    navigation.navigate("Guide")
  }

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Library Image: ", result);

    if (!result.canceled) {
      console.log("image selected: ", result.assets[0].uri)
      setImage(result.assets[0].uri)
      setSelection({ ...selection, image: result.assets[0].uri })

    }
  }

  return (
    <View>
      <ScrollView bounces={false} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag">

        <View style={[styles.container, colorScheme.content]}>
          {/* <View style={{paddingVertical: 10, paddingTop: 19}}>
          <Feather name="chevron-left" size={30} color="white" onPress={() => {
            setIsVisible(false)
            } } />
        </View> */}
          <View style={{ flexDirection: "column", paddingBottom: 5, }}>
            <TextInput
              placeholder={`Name of the Recipe`}
              placeholderTextColor={colors.gray}
              editable

              numberOfLines={1}
              maxLength={40}
              onChangeText={text => setText(text)}
              value={text}
              style={{ color: colorScheme.text, fontSize: 25, paddingBottom: 5 }}
            />
            <View style={{ backgroundColor: 'white', borderTopColor: "white", borderRadius: 12, height: 1 }} />
          </View>
          {image == '' ? <Entypo name="camera" size={35} color={colorScheme.text} style={{ padding: 12 }} onPress={() => {
            handleImageChange()
          }} /> : <TouchableOpacity onLongPress={() => handleImageChange()}>
            <Image source={{ uri: image }} style={{
            width: 300,
            height: 400,
            borderRadius: 20,
          }} />
          </TouchableOpacity>}

          <View style={{ flexDirection: "row" }}>

            {
              image.length > 1 ?
                <View style={{ marginRight: 10 }}>
                  <Button
                    label='remove'
                    color={colors.dark}
                    onPress={() => setImage('')}
                    style={{ marginHorizontal: 20, marginLeft: 10, marginRight: 10 }}
                  />
                </View>

                : ""
            }

            <Button
              label='Next'
              color={colors.lightPurple}
              onPress={handleSave}
              style={{ marginHorizontal: 20, marginLeft: 10 }}
            />
          </View>

        </View>
      </ScrollView>
    </View>

  )
}
