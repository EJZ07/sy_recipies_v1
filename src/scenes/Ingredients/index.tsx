import React, { useState, useEffect, useContext, Dispatch, SetStateAction, useRef } from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
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
import { firestore, } from '../../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { addPost, follow, unfollow } from '../../utils/firebaseFunctions'
import { Feather } from '@expo/vector-icons';
import moment from 'moment'
import styles from './styles'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type ModalProps = {
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
};


export default function Ingredients() {
  const route = useRoute()
  const popAction = StackActions.pop(1);
  const { userData, setSelection, selection } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const inputRef = useRef(null);
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  const [message, setMessage] = useState("")
  const [ingredients, setIngredients] = useState(selection.ingredients)
  const [isVisible, setIsVisible] = useState(true)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  useEffect(() => {
    console.log("Selection: ", selection)
  }, [])

  useEffect(() => {
    console.log("Current Ingredients: ", ingredients)
    setMessage("")
    inputRef?.current?.focus()
  }, [ingredients])


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
    let newArr = [...ingredients]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index] = value; // replace e.target.value with whatever you want to change it to

    setIngredients(newArr);
  }

  const handleRemoveIngredients = () => {
    let temp = [...ingredients]
    temp.pop()
    setIngredients(temp);
  }

  const handleNext = () => {
    let flag = true

    ingredients.forEach((item) => {
      if (item.length > 1) {
        flag = false
        setSelection({ ...selection, ingredients })
        navigation.navigate("Recipe")
      }
    })

    try {
      if (flag) throw "No ingredients"
      else ""
    } catch (e) {
      setMessage("*Please enter an ingredient")
    }

  }

  return (
    <View>



      <View style={{ paddingVertical: 10, paddingTop: 40, paddingBottom: 15 }}>
        <Feather name="chevron-left" size={30} color="white" onPress={() => {
          navigation.goBack()
        }} />
      </View>
      <ScrollView bounces={false}  keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag" >
    
          <View style={{ padding: 12, paddingTop: 0, }}>
            <Text style={[styles.title, { color: colorScheme.text }]}>Ingredients</Text>
            <View style={{ flexWrap: "wrap", flexDirection: "row", alignItems: "center", }}>
              {
                ingredients.map((item, index) => (
                  <View style={{ paddingRight: 10, paddingBottom: 10 }}>
                    <View style={{ borderWidth: 1, borderColor: colorScheme.text, borderRadius: 12 }}>
                      <TextInput
                        ref={inputRef}
                        key={index}
                        placeholder={`Paprika`}
                        placeholderTextColor={colors.gray}
                        editable
                        numberOfLines={1}
                        maxLength={20}
                        onChangeText={(e) => handleIngredients(index, e)}
                        value={item}
                        style={{ padding: 10, color: colorScheme.text, fontSize: 25, }}
                      />
                    </View>
                  </View>
                )
                )
              }

              <View style={{ paddingLeft: 5 }}>
                <AntDesign name="pluscircle" size={34} color={colors.gray} onPress={() => { setIngredients([...ingredients, ""]); inputRef?.current?.focus(); }} />
              </View>
            </View>
            {message.length > 1 ?
              <Text style={{ color: colors.secondary }}>{message}</Text>
              : ""}
          </View>


          <View style={{ flex: 1,  flexDirection: "row", justifyContent: "center" }} >
            {
              ingredients.length > 1 ?
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
              label='Next'
              color={colors.lightPurple}
              onPress={() => handleNext()}
              style={{ marginHorizontal: 20, marginLeft: 10 }}
            />
          </View>
       
      </ScrollView>

    </View>
  )
}
