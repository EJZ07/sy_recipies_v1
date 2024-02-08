import React, { useEffect, useCallback, useRef } from "react"
import { View, Text, StyleSheet, Image, useWindowDimensions, Alert, Pressable, RefreshControl, FlatList, Touchable, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { firestore } from '../../firebase/config'
import { doc, onSnapshot, setDoc, query, collection, getDocs, where, getDoc, orderBy } from 'firebase/firestore';
import { Dispatch, useState, useContext } from "react";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SetStateAction } from "react";
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import Modal from "react-native-modal";
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import TimeAgo from 'react-native-timeago';
import { UserDataContext } from "../../context/UserDataContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from '@react-native-masked-view/masked-view';
import ScreenTemplate from "../../components/ScreenTemplate";
import { useRoute } from "@react-navigation/native";


const Dm = () => {
    const ref = React.useRef<FlatList>(null)
    const route = useRoute()
    const { data, from } = route.params
    const inputRef = useRef(null);
    const navigation = useNavigation()
    const deviceHeight = useWindowDimensions().height;
    const deviceWidth = useWindowDimensions().width;
    const [image, setImage] = useState('')
    const [text, setText] = useState({})
    const [showCreate, setShowCreate] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const { userData } = useContext(UserDataContext)
    const [dmList, setDmList] = useState([])
    const { scheme } = useContext(ColorSchemeContext)

    const isDark = scheme === 'dark'
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getMessages();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getMessages = () => {

    }

    const handleSend = () => {
        console.log("Text: ", text)
        setDmList([...dmList, {sender: 1, message: text, image: image}])
        setText('')
    }

    useEffect(() => {
        console.log("DM LIST: ", dmList)
    }, [dmList])


    return (
        <View style={{ height: deviceHeight, flex: 1 }}>
            <View style={{ justifyContent: "flex-start", padding: 8, paddingTop: 25, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Feather name="chevron-left" size={30} color="white" onPress={() => { navigation.goBack() }} />
                <Avatar size="small" source={{ uri: data.avatar }} rounded />
                <Text style={[{ color: colorScheme.text }, styles.title]}>{data.fullName}</Text>
            </View>


            <View style={{ flex: 1, paddingTop: 12 }}>

                <FlatList

                    ref={ref}

                    contentContainerStyle={{ flexGrow: 4 }}
                    scrollEnabled={true}
                    style={[, styles.main,]}
                    data={dmList}
                    keyExtractor={(item) => item?.id + (Math.random() * 9999)}
                    renderItem={({ index, item }) => <View style={[styles.container, { width: deviceWidth / 2.2, alignSelf: "flex-end" }]}><Text style={styles.message}>{item.message}</Text></View>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }

                />
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                style={{ flexDirection: "column", justifyContent: "flex-end", flex: 1 }}
                onAccessibilityEscape={() => Keyboard.dismiss()}
                keyboardVerticalOffset={50}
            >





                <View style={{ flexDirection: "row", gap: 10, backgroundColor: colors.dark, padding: 12, paddingBottom: 25 }}>
                    <View style={{ borderWidth: 1, borderColor: colorScheme.text, borderRadius: 25, flex: 1 }}>
                        <TextInput
                            ref={inputRef}
                            multiline
                            placeholder={'Type a message'}
                            placeholderTextColor={colors.gray}
                            editable
                            numberOfLines={1}
                            maxLength={20}
                            onChangeText={setText}
                            value={text}
                            style={{ padding: 15, color: colorScheme.text, fontSize: 16, paddingTop: 15 }}
                        />
                    </View>
                    <Pressable style={styles.share} onPress={handleSend}>
                        <FontAwesome name="send" size={16} color="black" />
                    </Pressable>
                </View>


            </KeyboardAvoidingView>
        </View>
    )


}

const styles = StyleSheet.create({
    backModal: {
        justifyContent: "flex-end",
        margin: 0,
        backgroundColor: colors.dark,
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,

        padding: 20
    },
    share: {
        backgroundColor: colors.lightGrayPurple,
        height: 40,
        width: 40,
        borderRadius: 90,
        justifyContent: "center",
        alignItems: "center"
    },
    main: {
        flex: 1,


    },
    container: {
        backgroundColor: colors.blueLight,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12,
        padding: 12,
        marginVertical: 12
    },
    message: {
        fontSize: fontSize.medium,
        color: colors.white,
        fontWeight: "500"

    },
    card: {

    },
    title: {

        fontWeight: "600",
        fontSize: fontSize.large,

    },
    lightContent: {
        backgroundColor: '#e6e6fa'
    },
    darkContent: {
        backgroundColor: '#696969'
    },
})

export default Dm;
