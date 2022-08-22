import "./Settings.css"

import { useHistory, useParams } from "react-router-dom"
import { useEffect, useState, useMemo } from "react";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import Select from 'react-select'
import countryList from 'react-select-country-list'

export default function Settings() {
  const history = useHistory();
  const { id } = useParams();
  const [success, setSuccess] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { document, error } = useDocument("users", id)
  const { user } = useAuthContext();
  const { updateDocument } = useFirestore("users");
  const [i, setI] = useState(0);
  const [formError, setFormError] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const countryHandler = country => {
    setCountry(country)
  }

  useEffect(() => {
    if (document) {
      if (document.country) {
        setCountry(document.country)
      }
      if (document.bio) {
        setBio(document.bio)
      }
    }
  }, [document]);

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError(null);

    try {

      setIsPending(true);
      if (!country) {
        setFormError("Please select a valid location");
        setIsPending(false);
        return;
      }


      // const deletePath = user.photoURL;
      // await projectStorage.refFromURL(deletePath).delete(thumbnail);

      // const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`;
      // const image = await projectStorage.ref(uploadPath).put(thumbnail);
      // const imageUrl = await image.ref.getDownloadURL();

      // await user.updateProfile({ displayName, photoURL: imageUrl })


      await updateDocument(user.uid, {
        country,
        bio: bio!==""?bio:"",
      });

      setCountry(country)
      setBio(bio)
      setIsPending(false);
      setSuccess("Profile updated");
      setTimeout(()=>{
             history.push("/")},1000);

    } catch (err) {
      setFormError(err.message);
      setIsPending(false);
    }
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!document) {
    return <div>Loading...</div>
  }



  return (
    <form className="settings-form"
      onSubmit={handleSubmit}>
      <h2>Settings</h2>
      <label>
        <span>Update location</span>
        <Select options={options} value={country} onChange={countryHandler} />
      </label>
      <label>
        <span>Update bio</span>
        <textarea
          type="text"
          onChange={e => {
            setBio(e.target.value)
            setI(e.target.value.length)
          }}
          value={bio} />
        {i <= 100 ? <p>{i}/100</p> : <p className="error">{i}/100 - Character limit exceeded</p>}
      </label>
      {error && <p className="error">{error}</p>}
      <button className="btn">Update profile</button>
      {formError && <p className="error">{formError}</p>}
      {!isPending && success && <p className="success">{success}</p>}
    </form>
  )
}
