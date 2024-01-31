import {StyleSheet} from 'react-native'
import { colors, fontSize } from '../../theme';

const styles = StyleSheet.create({
    main: {
      flex: 1,
      width: '100%',
    },
    footerView: {
      flex: 1,
      alignItems: "center",
      marginBottom: 20,
      marginTop: 20
    },
    footerText: {
      fontSize: fontSize.large,
    },
    footerLink: {
      color: colors.blueLight,
      fontWeight: "bold",
      fontSize: fontSize.large
    },
    link: {
      textAlign: 'center'
    },
    eulaLink: {
      color: colors.blueLight,
      fontSize: fontSize.middle
    }
  })

export default styles
