import {StyleSheet} from 'react-native';
import { colors, fontSize } from '../../theme'


const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: colors.lightyellow,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  darkContent: {
    backgroundColor: colors.gray,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.middle,
    marginBottom: 20,
    textAlign: 'center'
  },
  contents: {
    fontSize: fontSize.small,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  send: {
    position: "absolute", 
    height: 60, 
    width: 60, 
    borderRadius: 30, 
    backgroundColor: "#3686EF", 
    justifyContent: 'center', 
    zIndex: 200,
    
    right: 30, 

    shadowColor: "#000000",
    shadowOpacity: 0.3033,
    shadowRadius: 2.5,
    shadowOffset: {
        height: 3,
        width: 1
    },
    elevation: 5,
  },
})

  export default styles