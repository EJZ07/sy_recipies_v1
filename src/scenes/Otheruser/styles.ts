import { Text, View, StyleSheet } from "react-native";

import { colors, fontSize } from '../../theme';

const styles = StyleSheet.create({
    lightContent: {
      backgroundColor: '#e6e6fa'
    },
    darkContent: {
      backgroundColor: '#696969'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: fontSize.xxxLarge,
      marginBottom: 20,
      textAlign: 'center'
    },
    field: {
      fontSize: fontSize.middle,
      textAlign: 'center',
    },
  })
  

export default styles
