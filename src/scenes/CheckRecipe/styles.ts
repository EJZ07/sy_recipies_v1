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
      fontSize: fontSize.large,
    
    },
    field: {
      fontSize: fontSize.middle,
      textAlign: 'center',
    },
    info: {
      padding: 16,
      paddingTop: 10,
      paddingBottom: 28,
      backgroundColor: colors.dark,
    },
    contents: {
      fontSize: fontSize.middle,
      fontWeight: "500"
  },
  name: {
    fontSize: fontSize.xxLarge,
  },
  share: {
    backgroundColor: colors.lightGrayPurple, 
    paddingHorizontal: 11, 
    paddingVertical: 10,
    borderRadius: 57,
    justifyContent: "center"
  }
  })
  

export default styles
