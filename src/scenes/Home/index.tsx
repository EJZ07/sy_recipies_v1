import React, { useEffect, useState, useContext, useLayoutEffect, useCallback } from 'react'
import { Text, View, ScrollView, StyleSheet, Pressable, useWindowDimensions, Image, FlatList, RefreshControl, } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import IconButton from '../../components/IconButton'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { doc, onSnapshot, setDoc, query, collection, getDocs, where, getDoc, orderBy } from 'firebase/firestore';
import Post from '../../components/Post'
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { FlagContext } from '../../context/FlagContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { sendNotification } from '../../utils/SendNotification'
import { getKilobyteSize } from '../../utils/functions'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';

import styles from './styles'
export default function Home() {
    const navigation = useNavigation()
    const deviceHeight = useWindowDimensions().height;
    const deviceWidth = useWindowDimensions().width;
    const [token, setToken] = useState('')
    const [postList, setPostList] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const { userData } = useContext(UserDataContext)
    const { rerender } = useContext(FlagContext)
    const { scheme } = useContext(ColorSchemeContext)

    const isDark = scheme === 'dark'
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const getPosts = async () => {
        const usersRef = await collection(firestore, 'posts')
        const q = query(usersRef, orderBy("createdAt", "desc"));
        let temp = []
        const querySnapshot = await getDocs(q);

        // console.log("THE SNAPSHOT: ", querySnapshot)
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log("DOC HOME: ", doc.data())
        
            temp.push({id: doc.id, data: doc.data()})
            // setUserList([...userList, ...[doc.data()]])
        });

        setPostList(temp)
    }

    useEffect(() => {
        getPosts();
    }, [rerender])

    const onNotificationPress = async () => {
        const res = await sendNotification({
            title: 'Hello',
            body: 'This is some something 👋',
            data: 'something data',
            token: token.token
        })
        console.log(res)
    }



    return (
        <ScreenTemplate>
            {/* <Pressable style={[styles.send, { top: deviceHeight - 240 }]} onPress={() =>
                navigation.navigate('ModalStacks', {
                    screen: 'Create',
                    params: {
                        data: userData,
                        from: 'Home screen'
                    }
                })} >
                <Entypo name="plus" size={25} color="white" style={{ textAlign: 'center' }} />
            </Pressable> */}
        
               
                 <FlatList
                 numColumns={2}
                    style={[, styles.main, {width: deviceWidth}]}
                    data={postList}
                    keyExtractor={(item) => item?.data.id + (Math.random() * 9999)}
                    renderItem={({ index, item }) => <Post key={item.id} index={index} data={item.data} id={item.id} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }

                />
         


        </ScreenTemplate>
    )
}

