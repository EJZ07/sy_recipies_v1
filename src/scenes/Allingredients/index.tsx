import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, useWindowDimensions, FlatList, Text, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { useRoute } from '@react-navigation/native';
import { usePromiseTracker } from 'react-promise-tracker';
import { colors, fontSize } from '../../theme';
import Ingredientcheck from '../../components/Ingredientcheck';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button'
import ingredients from "../../../assets/data/ingredients.json"
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
interface componentNameProps {
    url: string;
}

const Allingredients = () => {
    const route = useRoute();
    const { promiseInProgress } = usePromiseTracker();
    const [value, setValue] = useState('')
    const [filtered, setFiltered] = useState([])
    const [isFocus, setIsFocus] = useState(false);
    const deviceWidth = useWindowDimensions().width
    const deviceHeight = useWindowDimensions().height
    const [items, setItems] = useState([])
    const [open, setOpen] = useState(false)
    const { scheme } = useContext(ColorSchemeContext)
    const isDark = scheme === 'dark'
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }

    const { list, id } = route.params
    useEffect(() => {
        let temp = []
        ingredients.forEach((ele, index) => { temp.push({ label: ele, value: index }) })
        setItems(temp)
    }, [])

    const handleFilter = (e) => {
        let temp = []

        ingredients.forEach((ele) => {
            if (ele.includes(e)) temp.push(ele)
        })
        setFiltered(temp)

    }


    return (

        <ScreenTemplate>
            <View style={{ flex: 1, paddingTop: 110, paddingHorizontal: 15 }}>
                <Text style={[styles.title, { color: colorScheme.text }]}>Ingredients</Text>
                <FlatList
                    numColumns={2}
                    contentContainerStyle={{ flexGrow: 4 }}
                    scrollEnabled={true}
                    style={[, styles.main,]}
                    data={list}
                    keyExtractor={(item) => item?.id + (Math.random() * 9999)}
                    renderItem={({ index, item }) => <Ingredientcheck key={index} ingredient={item} id={id} />}
                    showsVerticalScrollIndicator={false}

                />
                <DropDownPicker
                    searchable={true}
                    max={10}
                  
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                />

                <Button
                    label='Buy Ingredients'
                    size={12}
                    textColor={{ color: "black", fontWeight: "600" }}
                    buttonStyle={{ borderRadius: 22, height: 40 }}
                    color={colors.lightGrayPurple}
                    onPress={() => {
                        alert("Contact Vendor")
                    }}
                />

            </View>
        </ScreenTemplate>


    );
};

export default Allingredients;

const styles = StyleSheet.create({
    title: {
        fontSize: fontSize.xxxLarge,
        marginBottom: 10,
    },
    main: {
        flex: 1,
        marginTop: 10,

    },
    searchItem: {
        color: "black",
        height: 60,
        fontSize: 30,

        paddingLeft: 25
    },

});
