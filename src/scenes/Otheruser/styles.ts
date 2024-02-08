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
      padding: 16,
      
      backgroundColor: colors.dark
    },
    title: {
      fontSize: fontSize.large,
      

    },
    title2: {
      fontSize: fontSize.large, 
      paddingTop: 40,
      paddingBottom: 20

    },
    field: {
      fontSize: fontSize.xxxLarge,
      fontWeight: "700",
      textAlign: 'center',
      paddingVertical: 10
    },
    follow: {
      fontSize: fontSize.medium,
      fontWeight: "500",
      textAlign: 'center',
      paddingVertical: 10
    },
    
  })
  

export default styles
