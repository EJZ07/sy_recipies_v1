import {StyleSheet } from 'react-native'
import { colors, fontSize } from "../../theme"

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width:'100%'
    },
    container2: {
      padding: 12,
      justifyContent: "flex-start",
      flexDirection: "column",
      
    },
    field: {
      fontSize: fontSize.middle,
      textAlign: 'center',
    },
    item: {
      fontSize: 22,
      fontWeight: '500',
    },
    item2: {
      fontSize: 18,
      fontWeight: '500',
      fontStyle: 'italic'
    }
  })

  export default styles