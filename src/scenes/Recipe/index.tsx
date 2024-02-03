import React, { useState, useEffect, useContext, Dispatch, SetStateAction, useRef } from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Dimensions, Pressable, Image } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation, StackActions } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { storage } from '../../utils/Storage'
import { UserDataContext } from '../../context/UserDataContext'
import { FlagContext } from '../../context/FlagContext'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { addPost, follow, unfollow } from '../../utils/firebaseFunctions'
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment'
import styles from './styles'

type ModalProps = {
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
};


export default function Recipe() {
  const route = useRoute()
  const popAction = StackActions.pop(1);
  const { userData, setSelection, selection } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const inputRef = useRef(null);
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  const [steps, setSteps] = useState([{ text: "", image: "" }])
  const [isVisible, setIsVisible] = useState(true)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  useEffect(() => {
    loadStorage()
    console.log("Selection: ", selection)
  }, [])

  useEffect(() => {
    console.log("Current Steps: ", steps)
    inputRef?.current?.focus()
  }, [steps])


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

  const handleIngredients = (index, value) => {
    let newArr = [...steps]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index].text = value; // replace e.target.value with whatever you want to change it to

    setSteps(newArr);
  }

  const handleRemoveIngredients = () => {
    let temp = [...steps]
    temp.pop()
    setSteps(temp);
  }

  const handleNext = () => {
    setSelection({ ...selection, steps })

  }

  const handleImageChange = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Library Image: ", result);

    if (!result.canceled) {
      console.log("image selected: ", result.assets[0].uri)
      let newArr = [...steps]
      newArr[index].image = result.assets[0].uri
      setSteps(newArr)

    }
  }

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { width: Dimensions.get('window').width }]}>


      <View style={{ paddingVertical: 10, paddingTop: 40, paddingBottom: 15 }}>
        <Feather name="chevron-left" size={30} color="white" onPress={() => {
          navigation.goBack()
        }} />
      </View>
      <View style={{ padding: 12, paddingTop: 0, width: Dimensions.get('window').width }}>
        <Text style={[styles.title, { color: colorScheme.text }]}>The Recipe</Text>
        <View style={{ flexDirection: "column", }}>
          {
            steps.map((item, index) => (
              <View style={{ paddingRight: 10, paddingBottom: 10, }}>
                <View style={{ borderWidth: 1, borderColor: colorScheme.text, borderRadius: 12, }}>
                  {
                    item?.image ? 
                    <View style={{padding: 12}}>
                        <Image source={{ uri: item.image }} style={{
                        width: 150,
                        height: 150,
                        borderRadius: 20,
                    }} />
                    </View> : ""

                  }
                  <TextInput
                    ref={inputRef}
                    key={index}
                    placeholder={`Step ${index + 1}`}
                    placeholderTextColor={colors.gray}
                    multiline
                    editable
                    numberOfLines={3}

                    onChangeText={(e) => handleIngredients(index, e)}
                    value={item.text}
                    style={{ padding: 10, color: colorScheme.text, fontSize: 20 }}
                  />
                  {
                    item?.image?.length < 5 ? <Pressable style={{ backgroundColor: colors.gray, alignItems: "center", borderBottomEndRadius: 12, borderBottomStartRadius: 12, zIndex: -2 }} onPress={() => handleImageChange(index)}>
                      <Entypo name="camera" size={15} color={colorScheme.text} style={{ padding: 12 }} />

                    </Pressable> : ""
                  }
                </View>
              </View>
            )
            )
          }


        </View>
        <View style={{ paddingTop: 10 }}>
          <AntDesign name="pluscircle" size={34} color={colors.gray} onPress={() => { setSteps([...steps, { text: "", image: "" }]); inputRef?.current?.focus(); }} />
        </View>
      </View>


      <View style={{ flex: 1, marginLeft: 10, flexDirection: "row", justifyContent: "center" }} >
        {
          steps.length > 1 ?
            <View style={{ marginRight: 10 }}>
              <Button
                label='Remove'
                color={colors.secondary}
                onPress={() => handleRemoveIngredients()}
                style={{ marginHorizontal: 20, marginLeft: 10, marginRight: 10 }}
              />
            </View>

            : ""
        }
        <Button
          label='Post Recipe!'
          color={colors.green}
          onPress={() => alert("POSTED")}
          style={{ marginHorizontal: 20, marginLeft: 10 }}
        />
      </View>

    </KeyboardAvoidingView>

  )
}
