import { useState, useEffect } from 'react'
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useCollection } from "./useCollection";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const {documents} = useCollection("users");

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup      
      if(!thumbnail.name){
        throw new Error(`No file selected`)
      }

      const res = await projectAuth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not complete signup')
      }

      //upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/thumbnail`;
      const image = await projectStorage.ref(uploadPath).put(thumbnail);
      const imageUrl = await image.ref.getDownloadURL();

      // add display name & image to user
      await res.user.updateProfile({ displayName, photoURL: imageUrl })

      //create a user document
      await projectFirestore.collection("users").doc(res.user.uid).set({
        online:true,
        displayName,
        photoURL: imageUrl,
      });

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}