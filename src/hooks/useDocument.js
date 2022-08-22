import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"
import { useHistory } from "react-router-dom"

export const useDocument = (collection, id) => {
  const history = useHistory();
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // realtime document data
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id)

    const unsubscribe = ref.onSnapshot(snapshot => {
      // need to make sure the doc exists & has data
      if (snapshot.data()) {
        setDocument({ ...snapshot.data(), id: snapshot.id })
        setError(null)
      }
      else {
        setError('No such document exists')
        setTimeout(() => {
          history.push("/")
        }, 1000);
      }
    }, err => {
      console.log(err.message)
      setError('failed to get document')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [collection, id, history])

  return { document, error }
}