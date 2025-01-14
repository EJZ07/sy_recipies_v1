import { Text, View, StyleSheet } from "react-native";

import { colors, fontSize } from '../../theme';

const styles = StyleSheet.create({
    lightContent: {
      backgroundColor: '#e6e6fa'
    },
    darkContent: {
      backgroundColor: colors.black
    },
    container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
   
      marginTop: 25,
      paddingHorizontal: 8,
    },
    title: {
      fontSize: fontSize.xxxLarge,
      marginBottom: 15,
  
      
    },
    field: {
      fontSize: fontSize.middle,
      textAlign: 'center',
    }, 
    modal: {
   
   
     
    },
  })
  

export default styles
