import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator, useWindowDimensions, FlatList, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { useRoute } from '@react-navigation/native';
import { usePromiseTracker } from 'react-promise-tracker';
import { colors, fontSize } from '../../theme';
import Ingredientcheck from '../../components/Ingredientcheck';
import ScreenTemplate from '../../components/ScreenTemplate';

interface componentNameProps {
    url: string;
}

const Allingredients = () => {
    const route = useRoute();
    const { promiseInProgress } = usePromiseTracker();
    const deviceWidth = useWindowDimensions().width
    const deviceHeight = useWindowDimensions().height
    const { scheme } = useContext(ColorSchemeContext)
    const isDark = scheme === 'dark'
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }

    const { list, id } = route.params

    return (

        <ScreenTemplate>
            <View style={{flex: 1, paddingTop: 60, paddingHorizontal: 15}}>
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

});
