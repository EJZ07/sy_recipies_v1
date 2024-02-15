import React, { useEffect, useCallback, useRef } from "react"
import { View, Text, StyleSheet, Image, useWindowDimensions, Alert, Pressable, RefreshControl, FlatList, Touchable, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { firestore } from '../../firebase/config'
import { doc, onSnapshot, setDoc, query, collection, getDocs, where, getDoc, orderBy, serverTimestamp } from 'firebase/firestore';
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
import { useRoute } from "@react-navigation/native";
import { sendMessage } from "../../utils/firebaseFunctions";
import { useViewRefSet } from "react-native-reanimated/lib/typescript/reanimated2/ViewDescriptorsSet";


const Dm = () => {
    const ref = React.useRef<FlatList>(null)
    const route = useRoute()
    const { data, from, conversationId } = route.params
    const inputRef = useRef(null);
    const navigation = useNavigation()
    const deviceHeight = useWindowDimensions().height;
    const deviceWidth = useWindowDimensions().width;
    const [image, setImage] = useState('')
    const [text, setText] = useState('')
    const [conversation, setConversation] = useState(conversationId)
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

    const getMessages = async () => {
        console.log("CONVERSATION: ", conversation)
        const usersRef = await collection(firestore, 'messages', conversation, "text")
        const q = query(usersRef, orderBy("createdAt"));
        

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const temp = []
            QuerySnapshot.forEach((doc) => {
                temp.push(doc.data())
            })

            setDmList(temp)
        })

        return () => unsubscribe;
        // const querySnapshot = await getDocs(q);

        // // console.log("THE SNAPSHOT: ", querySnapshot)
        // querySnapshot.forEach((doc) => {
        //     // doc.data() is never undefined for query doc snapshots
        //     console.log("DOC HOME: ", doc.data())

        //     temp.push(doc.data())
        //     // setUserList([...userList, ...[doc.data()]])
        // });

    
    }

    const handleSend = (data) => {
        console.log("Text: ", text)
        const newData = { sender: userData.id, sendTo: data.id, message: text, image: image, createdAt: new Date()}
        sendMessage({ userData, newData, conversation, data }).then((res) => {
            setConversation(res)
        })

        setDmList([...dmList, { sender: userData.id, sendTo: data.id, message: text, image: image, createdAt: new Date(), isNew: 1}])
        setText('')
    }

    useEffect(() => {
        console.log("DM LIST: ", dmList)
        console.log("The data from this DM: ", data)
    }, [dmList])

    useEffect(() => {
        getMessages()
        console.log("User Data: ", userData.id)
    }, [])

    const checkTime = ({ current, index }) => {
        if (index != 0) {
            let diffMs = dmList[index - 1]?.createdAt - current
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if (diffMins > 30) return 1
            else return 0
        } else {
            return 1
        }
    }

    const checkTime2 = ({ current }) => {
        let currentDate = new Date()
        let diffMs = (currentDate - current)
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        if (diffHrs > 24) return current.toDateString()
        else return current.toLocaleTimeString()
    }

    const Message = ({ item, index }) => {
        console.log("Type: ", typeof(item?.createdAt))
        let theDate
        
        if(item.hasOwnProperty("isNew")) {
            theDate = item?.createdAt
        }else{
            theDate = item?.createdAt.toDate()
        }
        return (
            <View >
                {checkTime({ current: theDate, index: index }) ?
                    <Text style={{ color: colors.gray, textAlign: "center", paddingBottom: 16 }}>{checkTime2({ current: theDate })}</Text> :
                    ""}
                {
                    item.sender == userData.id ? <TouchableOpacity activeOpacity={0} >
                        <View style={[styles.container, { alignSelf: 'flex-end' }, { maxWidth: deviceWidth / 1.1 }]}>
                            <Text selectable={true} style={styles.message}>{item.message}</Text>
                        </View>
                    </TouchableOpacity> : <TouchableOpacity activeOpacity={0} >
                        <View style={[styles.sContainer, { alignSelf: 'flex-start' }, { maxWidth: deviceWidth / 1.1 }]}>
                            <Text selectable={true} style={styles.message}>{item.message}</Text>
                        </View>
                    </TouchableOpacity>
                }

            </View>
        )
    }


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
                    keyExtractor={(item) => item?.createdAt?.toString()}
                    renderItem={({ index, item }) => <Message key={index} item={item} index={index} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }

                />
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                style={{ justifyContent: "flex-end",  }}
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

                            maxLength={220}
                            onChangeText={setText}
                            value={text}
                            style={{ padding: 15, color: colorScheme.text, fontSize: 16, paddingTop: 15 }}
                        />
                    </View>
                    <Pressable style={styles.share} onPress={() => handleSend(data)}>
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
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopLeftRadius: 16,
        padding: 12,
        paddingHorizontal: 15,
        marginVertical: 3
    },
    sContainer: {
        backgroundColor: colors.gray,
        borderBottomRightRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 16,
        padding: 12,
        paddingHorizontal: 15,
        marginVertical: 3
    },
    message: {
        fontSize: fontSize.large,
        color: colors.white,
        fontWeight: "400",
        textAlign: "left"

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
