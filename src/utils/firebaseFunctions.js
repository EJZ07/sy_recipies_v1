import { firestore, } from "../firebase/config";
import { doc, onSnapshot, collection, query, getDoc, setDoc, deleteDoc, onVal } from 'firebase/firestore';



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
    //   navigation.goBack()
    } catch (e) {
      console.log("Error adding data: ", e)
    }

}

const addPost = async ({userData, data}) => {
    const postRef = await doc(collection(firestore, 'posts' ))
    // onVal(postRef, (snapshot) => {
    //     const data = snapshot.val()
    //     console.log("Data Snapshot: ", data)
    // })
    await setDoc(postRef, data)

    const uPostRef = await doc(collection(firestore, 'users', userData.id, 'posts' ))
    await setDoc(uPostRef, data)
}   

const getUser = async ({data}) => {
    const currentUserRef = doc(firestore, "users", data.id)
    const docSnap = await getDoc(currentUserRef)
    let user = {}
    if (docSnap.exists()) {
        // console.log("Document Data: ", docSnap.data())
        return docSnap.data()
      
    }else{
        return "No such document"
    }
}

export { follow, unfollow, addPost, getUser}