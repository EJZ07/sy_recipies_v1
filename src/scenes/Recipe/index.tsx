import React, { useState, useEffect, useContext, Dispatch, SetStateAction, useRef } from 'react'
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Dimensions, Pressable, Image, useWindowDimensions, TouchableOpacity } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation, StackActions } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { UserDataContext } from '../../context/UserDataContext'
import { FlagContext } from '../../context/FlagContext'
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator'
import { Entypo } from '@expo/vector-icons';
import { firestore, storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { addPost, follow, unfollow } from '../../utils/firebaseFunctions'
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment'
import styles from './styles'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showToast } from '../../utils/ShowToast'
import { Skeleton } from '@rneui/base'

type ModalProps = {
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
};


export default function Recipe() {
  const route = useRoute()
  const popAction = StackActions.pop(1);
  const deviceHeight = useWindowDimensions().height;

  const { userData, setSelection, selection } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const inputRef = useRef(null);
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  const [progress, setProgress] = useState('')
  const [steps, setSteps] = useState(selection.steps)
  const [isVisible, setIsVisible] = useState(true)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }

  useEffect(() => {

    console.log("Selection: ", selection)
  }, [steps])

  useEffect(() => {

    inputRef?.current?.focus()
  }, [steps])



  const handlePost = async () => {
    console.log("Post Selection: ", selection)
    const data = {
      id: userData.id,
      name: userData.fullName,
      image: selection.image,
      avatar: userData.avatar,
      title: selection.title,
      ingredients: selection.ingredients,
      steps: steps,
      likeCount: 0,
      comments: [],
      createdAt: new Date()
    }
    addPost({ userData, data })
    setRerender(!rerender)
    showToast({
      title: 'Recipe Posted',
      body: 'Recipe Posted',
      isDark
    })


    setSelection({})
    navigation.navigate("Home")
  }

  const handleIngredients = (index, value) => {
    let newArr = [...steps]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index].text = value; // replace e.target.value with whatever you want to change it to

    setSteps(newArr);

  }

  const handleRemoveIngredients = () => {
    const storage = getStorage();
  
    // Create a reference to the file to delete
    const desertRef = ref(storage, steps[-1].image);

    // Delete the file
    deleteObject(desertRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log("Deleting image ERROR: ", error)
    });
    let temp = [...steps]
    temp.pop()
    setSteps(temp);
    // setSelection({...selection, steps});
  }

  const handleNext = () => {
    setSelection({ ...selection, steps })

  }

  const handleImageChange = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [9, 16],
      quality: 1,
    });

    console.log("Library Image: ", result);

    if (!result.canceled) {
      console.log("image selected: ", result.assets[0].uri)

      let actions = [];
      actions.push({ resize: { width: 300 } });
      const manipulatorResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        actions,
        {
          compress: 0.4,
        },
      );
      const localUri = await fetch(manipulatorResult.uri);
      const localBlob = await localUri.blob();
      const filename = userData.id + new Date().getTime()
      const storageRef = ref(storage, `posts/steps/${userData.id}/` + filename)
      const uploadTask = uploadBytesResumable(storageRef, localBlob)
      uploadTask.on('state_changed',
        (snapshot) => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(parseInt(progress) + '%')
        },
        (error) => {
          console.log(error);
          alert("Upload failed.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setProgress('')

            let newArr = [...steps]
            newArr[index].image = downloadURL
            setSteps(newArr)
          });
        }
      );

    }
  }

  return (

    <View>
      <View style={{ paddingVertical: 10, paddingTop: 40, paddingBottom: 15 }}>
        <Feather name="chevron-left" size={30} color="white" onPress={() => {
          setSelection({ ...selection, steps });
          navigation.goBack()
        }} />
      </View>
      <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'} keyboardDismissMode="on-drag" extraHeight={220}>


        <View style={{ padding: 12, paddingTop: 0, width: Dimensions.get('window').width }}>
          <Text style={[styles.title, { color: colorScheme.text }]}>Give us Your Recipe</Text>
          <View style={{ flexDirection: "column", }}>
            {
              steps.map((item, index) => (
                <View style={{ paddingRight: 10, paddingBottom: 10, }}>
                  <View style={{ borderWidth: 1, borderColor: colorScheme.text, borderRadius: 12, }}>
                    {
                      item?.image ?
                        <View style={{ padding: 12 }}>
                          <TouchableOpacity onLongPress={() => handleImageChange(index)} >
                            <Image source={{ uri: item.image }} style={{
                              width: 100,
                              height: 100,
                              borderRadius: 20,
                            }} />
                          </TouchableOpacity>
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
          <View style={{ paddingTop: 10, width: 100 }}>
            <AntDesign name="pluscircle" size={34} color={colors.gray} onPress={() => { setSteps([...steps, { text: "", image: "" }]); inputRef?.current?.focus(); }} />
          </View>
        </View>


        <View style={{ flex: 1, marginLeft: 10, flexDirection: "row", justifyContent: "center", marginBottom: deviceHeight / 6 }} >
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
            onPress={() => handlePost()}
            style={{ marginHorizontal: 20, marginLeft: 10 }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>


  )
}
