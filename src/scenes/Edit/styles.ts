import {StyleSheet} from 'react-native';
import { colors, fontSize } from '../../theme'



const styles = StyleSheet.create({
    progress: {
      alignSelf: 'center',
    },
    darkprogress: {
      alignSelf: 'center',
      color: colors.white,
    },
    main: {
      flex: 1,
      width: '100%',
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
    avatar: {
      margin: 30,
      alignSelf: "center",
    },
    changePasswordContainer: {
      paddingVertical: 30
    }
  })

  export default styles