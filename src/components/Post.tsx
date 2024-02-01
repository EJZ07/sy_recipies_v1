import React, { useRef, useContext, useEffect, useState} from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, Image } from 'react-native'
import { ColorSchemeContext } from '../context/ColorSchemeContext'
import { getUser } from '../utils/firebaseFunctions';
import { colors, fontSize } from '../theme'
import { firestore, } from "../firebase/config";
import { doc, onSnapshot, collection, query, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Post (props) {
    
    const { scheme } = useContext(ColorSchemeContext)
    const {data} = props
    const isDark = scheme === 'dark'
    const [user, setUser] = useState({})
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }

    const getUser = async () => {
        const currentUserRef = doc(firestore, "users", data.id)
        const docSnap = await getDoc(currentUserRef)

        if (docSnap.exists()) {
            console.log("Document Data: ", docSnap.data())
            setUser(docSnap.data())
          
        }else{
            return "No such document"
        }
    }


    useEffect(() => {
        getUser()
    }, [])

    return (
        <View style={[colorScheme.content, styles.plate]}>
            <View style={{ flexDirection: "row", padding: 12 }}>
                <Image source={{ uri: user?.avatar }} style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    marginRight: 10
                }} />
                <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <Text style={[styles.title, { color: colorScheme.text }]}>{user?.fullName}</Text>
                    <Text style={[styles.contents, { color: colorScheme.text }]}>{data?.text}</Text>
                </View>
            </View>

        </View>
    )
}

const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    plate: {
        backgroundColor: colors.darkPurple,
        borderRadius: 12,
        marginVertical: 5
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
        fontSize: fontSize.middle,
        marginBottom: 20,
        textAlign: 'center'
    },
    contents: {
        fontSize: fontSize.small,
    },
    field: {
        fontSize: fontSize.middle,
        textAlign: 'center',
    },
});