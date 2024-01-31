import { firestore, } from "../firebase/config";
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';



const follow = async ({ userData, data }) => {

    if (data.id == userData.id) {
        alert("You can't follow yourself");
    } else {
        try {

            const followRef = await doc(firestore, 'users', userData.id, 'following', data.id)
            await setDoc(followRef, data)
            console.log("New follow: ", followRef.id)
        } catch (e) {
            console.log("Error adding data: ", e)
        }
    }

}

const unfollow = async ({ userData, data }) => {
    
    try {

      const followRef = await doc(firestore, 'users', userData.id, 'following', data.id)
      await deleteDoc(followRef)
      console.log("Deleted Follower: ", followRef.id)
      navigation.goBack()
    } catch (e) {
      console.log("Error adding data: ", e)
    }

}

export { follow, unfollow}