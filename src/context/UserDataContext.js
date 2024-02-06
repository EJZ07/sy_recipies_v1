import React, { createContext, useState, useEffect } from 'react'
import { firestore, } from '../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const UserDataContext = createContext();

export const UserDataContextProvider = (props) => {
  const [userData, setUserData] = useState('')
  const [followList, setFollowList] = useState([])
  const [savedList, setSavedList] = useState([])
  const [likedList, setLikedList] = useState([])
  const [selection, setSelection] = useState({title: "", image: "", ingredients: [""], steps: [{ text: "", image: "" }]})

  useEffect(() => {
    getLiked()
  }, [])

  useEffect(() => {
    // getFollowers()
    getSaved()
   
  }, [])
  

  const getFollowers = async () => {
    const followingRef = await collection(firestore, 'users', userData.id, 'following')
    const q = query(followingRef);
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        console.log("FROM FOLLOWERS: ", doc.data())
        // doc.data() is never undefined for query doc snapshots
        temp.push(doc.id)
      });
    }


    setFollowList(temp)
  }

  const getSaved = async () => {
    const savedRef = await collection(firestore, 'users', userData.id, 'saved')
    const q = query(savedRef);
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        console.log("FROM SAVD: ", doc.data())
        // doc.data() is never undefined for query doc snapshots
        temp.push(doc.id)
      });
    }


    setSavedList(temp)
  }

  const getLiked = async () => {
    console.log("GET LIKED")
    const likedRef = await collection(firestore, 'users', userData.id, 'liked')
    const q = query(likedRef);
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log("FROM Liked CONTXTET: ", doc.id)
        temp.push(doc.id)
      });
    }


    setLikedList(temp)
  }


  return (
    <UserDataContext.Provider
      value={{
        userData, setUserData, 
        followList, setFollowList, 
        getFollowers,  selection, 
        setSelection, savedList, 
        setSavedList, likedList,
        setLikedList, getSaved,
        getLiked
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  )
}