import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [isLoginPending, setIsLoginPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setLoginError(null)
    setIsLoginPending(true)
  
    try {
      // login
      const res = await projectAuth.signInWithEmailAndPassword(email, password)
      

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsLoginPending(false)
        setLoginError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setLoginError(err.message)
        setIsLoginPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isLoginPending, loginError }
}