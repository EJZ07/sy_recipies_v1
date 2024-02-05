import React, { createContext, useState, useEffect } from 'react'
import { firestore, } from '../firebase/config';
import { doc, onSnapshot, collection, query, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const UserDataContext = createContext();

export const UserDataContextProvider = (props) => {
  const [userData, setUserData] = useState('')
  const [followList, setFollowList] = useState([])
  const [selection, setSelection] = useState({title: "", image: "", ingredients: [""], steps: [{ text: "", image: "" }]})

  useEffect(() => {
    getFollowers()
  }, [])

  const getFollowers = async () => {
    const followingRef = await collection(firestore, 'users', userData.id, 'following')
    const q = query(followingRef);
    let temp = []
    const querySnapshot = await getDocs(q);

    // console.log("THE SNAPSHOT: ", querySnapshot)
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        temp.push(doc.id)
      });
    }


    setFollowList(temp)
  }


  return (
    <UserDataContext.Provider
      value={{
        userData, setUserData, followList, setFollowList, getFollowers,  selection, setSelection
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  )
}