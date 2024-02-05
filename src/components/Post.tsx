import React, { useRef, useContext, useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, Image, useWindowDimensions, Pressable } from 'react-native'
import { ColorSchemeContext } from '../context/ColorSchemeContext'
import { getUser } from '../utils/firebaseFunctions';
import { colors, fontSize } from '../theme'
import { firestore, } from "../firebase/config";
import { doc, onSnapshot, collection, query, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function Post(props) {
    const deviceWidth = useWindowDimensions().width;
    const navigation = useNavigation();
    const { scheme } = useContext(ColorSchemeContext)
    const { data, index } = props
    const isDark = scheme === 'dark'
    const [user, setUser] = useState({})
    const [randomInt, setRandomInt] = useState(0)
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }

    const getUser = async () => {
        const currentUserRef = doc(firestore, "users", data.id)
        const docSnap = await getDoc(currentUserRef)

        if (docSnap.exists()) {
            console.log("Document Data1: ", docSnap.data())
            setUser(docSnap.data())

        } else {
            return "No such document"
        }
    }


    useEffect(() => {
        getUser()

    }, [])

    return (
        <Pressable style={[colorScheme.content, styles.plate, { width: deviceWidth / 2, }]} onPress={() => {
            navigation.navigate(
                'Look',
                {data: data,})
        }}>
            {
                index % 2 != 0 ? <View style={styles.right}>
                    <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <Text style={[styles.title, { color: colorScheme.text }]} adjustsFontSizeToFit={true}  numberOfLines={2}>{data?.title}</Text>
                        <Text style={[styles.contents, { color: colorScheme.text }]}>{user?.fullName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <AntDesign name="hearto" size={18} color={colorScheme.text} />
                        <Text style={[styles.contents, { color: colorScheme.text }]}>40</Text>
                    </View>
                </View> : ""
            }
            <Image source={{ uri: data?.image ? data?.image : "https://media.istockphoto.com/id/1185879263/vector/recipe-book-hand-drawn-cover-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=i3q2UZKxqUE5eZZs8f0WegcUYfKiEIfox1e6SdThLt0=" }} style={{
                minHeight: 275,
                borderRadius: 12,
                marginRight: 10,
                marginBottom: 5
            }} />
            {/* <Text style={{ color: colors.lightPurple, marginTop: 6, fontSize: fontSize.small }}>{data?.createdAt?.toDate().toDateString()}</Text> */}
            {
                index % 2 == 0 ? <View style={styles.left}>
                    <View style={{ flexDirection: "column", alignItems: "flex-start", width: 130 }}>
                        <Text style={[styles.title, { color: colorScheme.text }]} adjustsFontSizeToFit={true} numberOfLines={2}>{data?.title}</Text>
                        <Text style={[styles.contents, { color: colorScheme.text }]}>{user?.fullName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <AntDesign name="hearto" size={18} color={colorScheme.text} />
                        <Text style={[styles.contents, { color: colorScheme.text }]}>40</Text>
                    </View>
                </View> : ""
            }

        </Pressable>
    )
}

const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    plate: {
        overflow: "scroll",
        borderRadius: 12,
        marginVertical: 10
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        paddingRight: 15
    },
    right: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        paddingRight: 15
    },
    animation: {
        width: width * 0.25,
        height: height * 0.25,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: fontSize.large,
        marginBottom: 1,
     
    },
    contents: {
        fontSize: fontSize.middle,
    },
    field: {
        fontSize: fontSize.middle,
        textAlign: 'center',
    },
});