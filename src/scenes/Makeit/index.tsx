import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, useWindowDimensions, FlatList, Text, ScrollView, Image, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { useRoute } from '@react-navigation/native';
import { usePromiseTracker } from 'react-promise-tracker';
import { colors, fontSize } from '../../theme';
import Ingredientcheck from '../../components/Ingredientcheck';
import ScreenTemplate from '../../components/ScreenTemplate';
import { Svg, Defs, Path } from 'react-native-svg';
interface componentNameProps {
    url: string;
}

const Shape = () => {
    return (
        <Svg id="sw-js-blob-svg" viewBox="0 0 100 100">
            <Path fill="url(#sw-gradient)" d="M26.1,-23.7C30,-22.2,26.7,-11.1,22,-4.6C17.4,1.8,11.4,3.6,7.5,10.7C3.6,17.8,1.8,30.2,-2.7,32.9C-7.2,35.6,-14.4,28.6,-15.6,21.5C-16.8,14.4,-12,7.2,-14.1,-2.1C-16.1,-11.3,-25.1,-22.6,-23.8,-24.2C-22.6,-25.7,-11.3,-17.4,-0.1,-17.3C11.1,-17.2,22.2,-25.3,26.1,-23.7Z" width="100%" height="100%" transform="translate(50 50)" stroke-width="0" style="transition: all 0.3s ease 0s;" stroke="url(#sw-gradient)"></Path>
        </Svg>
    )
}

const Makeit = () => {
    const route = useRoute();
    const { data, id } = route.params
    const { promiseInProgress } = usePromiseTracker();
    const deviceWidth = useWindowDimensions().width
    const deviceHeight = useWindowDimensions().height
    const { scheme } = useContext(ColorSchemeContext)

    const [steps, setSteps] = useState(data?.steps)
    const isDark = scheme === 'dark'
    const colorScheme = {
        content: isDark ? styles.darkContent : styles.lightContent,
        text: isDark ? colors.white : colors.primaryText
    }

    useEffect(() => {
        console.log("Steps: ", steps)
    }, [steps])


    return (

        <ScreenTemplate>
            <ScrollView style={styles.main} bounces={false}>
                <Image source={{ uri: data.image }} style={{
                    width: deviceWidth,
                    height: deviceHeight / 3.7,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20
                }} />

                <View style={{ padding: 12, flex: 1 }}>

                    <Text style={[styles.title, { color: colors.white }]}>{data.title}</Text>

                    {steps.map((step, index) => (
                        <View style={{flex: 1}}>
                            {
                                index % 2 == 0 ? <View style={{ flexDirection: "row", marginVertical: 5, backgroundColor: colors.dark, padding: 12, borderRadius: 16, }}>
                                    <View style={{ flexDirection: "column" }}>
                                        <Text style={[{ color: colorScheme.text }, styles.step]}>Step: {index + 1}</Text>
                                        <Image source={{ uri: step.image }} style={{
                                            width: 140,
                                            height: 200,
                                            borderRadius: 20
                                        }} />
                                    </View>
                                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                                        <Text style={[{ color: colorScheme.text }, styles.content]}>{step.text}</Text>
                                    </View>

                                </View> :
                                    <View style={{ flexDirection: "row", marginVertical: 5, backgroundColor: colors.dark, padding: 12, borderRadius: 16 }}>
                                        <View style={{ paddingHorizontal: 10, flex: 1 }}>
                                            <Text style={[{ color: colorScheme.text }, styles.content]}>{step.text}</Text>
                                        </View>
                                        <View style={{ flexDirection: "column" }}>
                                            <Text style={[{ color: colorScheme.text }, styles.step]}>Step: {index + 1}</Text>
                                            <Image source={{ uri: step.image }} style={{
                                                width: 140,
                                                height: 200,
                                                borderRadius: 20
                                            }} />
                                        </View>

                                    </View>
                            }
                        </View>

                    ))}

                </View>

            </ScrollView>
        </ScreenTemplate>


    );
};

export default Makeit;

const styles = StyleSheet.create({
    title: {
        fontSize: fontSize.xxxLarge,
        marginBottom: 16
    },
    main: {
        flex: 1,

        // backgroundColor: colors.white,
    },
    step: {
        fontSize: fontSize.large,
        fontStyle: "italic",
        marginVertical: 10
    },
    content: {
        fontSize: fontSize.medium,
    }

});
