import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react'
import { Text, View, StyleSheet, TextInput, useWindowDimensions, Image, ScrollView, Touchable } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useRoute, useFocusEffect, useNavigation, StackActions } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { UserDataContext } from '../../context/UserDataContext'
import { FlagContext } from '../../context/FlagContext'
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import * as ImageManipulator from 'expo-image-manipulator'
import { Entypo, Feather } from '@expo/vector-icons';
import moment from 'moment'
import { firestore, storage, } from '../../firebase/config';
import styles from './styles'
import * as ImagePicker from 'expo-image-picker';
// import { firestore, storage } from '../../firebase/config';
import { TouchableOpacity } from 'react-native-gesture-handler'

type ModalProps = {
  isVisible?: boolean;
  setIsVisible?: Dispatch<SetStateAction<boolean>>;
};


export default function Create() {
  const route = useRoute()
  const popAction = StackActions.pop(1);
  const deviceWidth = useWindowDimensions()
  const { userData, selection, setSelection } = useContext(UserDataContext)
  const { rerender, setRerender } = useContext(FlagContext)
  const { scheme } = useContext(ColorSchemeContext)
  const [date, setDate] = useState('')
  const [image, setImage] = useState(selection.image)
  const [text, setText] = useState(selection.title)
  const [description, setDescription] = useState(selection.description)
  const [progress, setProgress] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const navigation = useNavigation()
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText
  }


  const handleSave = () => {
    setSelection({ ...selection, title: text, description: description })
    navigation.navigate("Guide")
  }

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false
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
      const storageRef = ref(storage, `posts/title/${userData.id}/` + filename)
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
            setImage(downloadURL)
            setSelection({ ...selection, image: downloadURL })

          });
        }
      );

    }
  }

  const handleImageDelete = () => {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, image);

    // Delete the file
    deleteObject(desertRef).then(() => {
      setImage('')
      // File deleted successfully
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log("Deleting image ERROR: ", error)
    });
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
          <View style={{ flexDirection: "column", paddingBottom: 15, }}>
            <TextInput
              placeholder={`Description`}
              placeholderTextColor={colors.gray}
              editable
              multiline

              maxLength={340}
              onChangeText={text => setDescription(text)}
              value={description}
              style={{ color: colorScheme.text, fontSize: 20, paddingBottom: 5, }}
            />
            <View style={{ backgroundColor: 'white', borderTopColor: "white", borderRadius: 12, height: 1, }} />
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
                    onPress={() => handleImageDelete()}
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
