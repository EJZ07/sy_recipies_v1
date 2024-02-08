import React, { useEffect, useCallback, useRef } from "react"
import { View, Text, StyleSheet, Image, useWindowDimensions, Alert, Pressable, RefreshControl, FlatList, Touchable, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
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
    const [text, setText] = useState('')
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

    }



    return (

        <View 
            style={{ flexDirection: "column", justifyContent: "flex-end", flex: 1 }}
        >
            <View style={{ justifyContent: "flex-start", padding: 8, paddingTop: 10, flexDirection: "row" }}>
                <Feather name="chevron-left" size={35} color="white" onPress={() => { navigation.goBack() }} />
                <Text style={[colorScheme.text, styles.title]}>text{data.fullName}</Text>
            </View>


            <MaskedView
                style={{ flex: 1, height: deviceHeight }}
                maskElement={<LinearGradient style={{ flex: 1 }} colors={['white', 'transparent']} start={{ x: 0.5, y: .8 }} end={{ x: 0.5, y: 1 }} />}
            >
                <FlatList

                    ref={ref}

                    contentContainerStyle={{ flexGrow: 4 }}
                    scrollEnabled={true}
                    style={[, styles.main,]}
                    data={dmList}
                    keyExtractor={(item) => item?.id + (Math.random() * 9999)}
                    renderItem={({ index, item }) => <Text style={styles.message}></Text>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }

                />
            </MaskedView>
       

                <View style={{ flexDirection: "row", gap: 10, backgroundColor: colors.dark, padding: 12, paddingBottom: 25}}>
                    <View style={{ borderWidth: 1, borderColor: colorScheme.text, borderRadius: 25, flex: 1 }}>
                        <TextInput
                            ref={inputRef}

                            placeholder={'Type a message'}
                            placeholderTextColor={colors.gray}
                            editable
                            numberOfLines={1}
                            maxLength={20}
                            onChangeText={setText}
                            value={text}
                            style={{ padding: 15, color: colorScheme.text, fontSize: 16, }}
                        />
                    </View>
                    <Pressable style={styles.share} onPress={handleSend}>
                        <FontAwesome name="send" size={16} color="black" />
                    </Pressable>
                </View>
         

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
        paddingHorizontal: 17,
        paddingVertical: 0,
        borderRadius: 90,
        justifyContent: "center"
    },
    main: {
        flex: 1,


    },
    message: {
        fontSize: fontSize.medium,
        color: colors.white,
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
