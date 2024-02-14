import { Text, View } from 'react-native'
import { Tag } from '../utils/Tags';



const TagItem = (props : {tag : Tag}) => {

    return (
        <View style={{
            backgroundColor: props.tag.backgroundColor,
            padding: 6,
            borderRadius: 2,
        }}>
            <Text style={{color: props.tag.textColor}}>
                {props.tag.name}
            </Text>
        </View>
    )
}



export default TagItem