//styles
import "./Create.css"

import { useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext";
import { projectStorage } from "../firebase/config";
import { useFirestore } from "../hooks/useFirestore";
import { useHistory } from "react-router-dom";

import firebase from "firebase";

export default function Create({ setShowModal }) {
  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("posts");

  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [music, setMusic] = useState("");
  const [photoError, setPhotoError] = useState(null);
  const [musicError, setMusicError] = useState(null);
  const [photoSuccess, setPhotoSuccess] = useState(null);
  const [musicSuccess, setMusicSuccess] = useState(null);
  const [percentage, setPercentage] = useState(0);

  const history = useHistory();

  const handleFileChange = e => {
    let selected = e.target.files[0];

    if (!selected) {
      setPhotoError("Please select a file");
      return
    }

    if (!selected.type.includes("image")) {
      setPhotoError("Selected file must be an image or video");
      return;
    }

    setPhotoSuccess("Selected: " + extractFilename(e.target.value));
    setPhotoError(null);

    if (selected.type.includes("image")) {
      setPhoto(selected);
    }
  }

  const handleSongChange = e => {
    let selected = e.target.files[0];

    if (!selected) {
      setMusicError("Please select a file");
      return
    }

    if (!selected.type.includes("audio")) {
      setPhotoError("Selected file must be an audio file");
      return;
    }

    setMusicSuccess("Selected: " + extractFilename(e.target.value));
    setMusicError(null);

    if (selected.type.includes("audio")) {
      setMusic(selected);
    }
  }

  const extractFilename = (path) => {
    if (path.substr(0, 12) === "C:\\fakepath\\")
      return path.substr(12); // modern browser
    var x;
    x = path.lastIndexOf('/');
    if (x >= 0) // Unix-based path
      return path.substr(x + 1);
    x = path.lastIndexOf('\\');
    if (x >= 0) // Windows-based path
      return path.substr(x + 1);
    return path; // just the filename
  }

  const handlePost = async e => {
    e.preventDefault();

    let imageURL = null;
    let audioURL = null;

    if (photo) {
      const uploadPath = `postImages/${user.uid}/${photo.name}`;
      const image = await projectStorage.ref(uploadPath).put(photo);
      imageURL = await image.ref.getDownloadURL();
    }

    if (music) {
      const uploadPath = `postAudios/${user.uid}/${title}`;
      const audio = projectStorage.ref(uploadPath).put(music);
      audio.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setPercentage((Math.round(progress * 100) / 100)*4)
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error) {
        // Handle unsuccessful uploads
      }, async function () {
        setShowModal(false);

        audioURL = await audio._ref.getDownloadURL()

        const createdBy = {
          display: user.displayName,
          photoURL: user.photoURL,
          id: user.uid,
        }

        const status = {
          title,
          photoURL: imageURL,
          audioURL: audioURL,
          comments: [],
          likes: [],
          createdBy,
        };

        await addDocument(status);
        if (!response.error) {
          history.push("/")
        }

        setPhoto(null);

      });
    }
  }

  return (
    <div className="modal-backdrop"
      onClick={e => {
        if (e.target !== e.currentTarget) {
          return;
        } else {
          setShowModal(false);
        }
      }}>
      <div className="modal">
        <div className="create-form">
          <h2 className="page-title">Post a new song</h2>
          <form onSubmit={e => { handlePost(e) }}>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value) }}
              placeholder="Song title" />
            <label>Audio
              <input
                className="photo-upload"
                type="file"
                onChange={handleSongChange}
                id="file-input"
              />
              {musicError && <div className="error">{musicError}</div>}
              {musicSuccess && <div className="success">{musicSuccess}</div>}
            </label>
            <label>Artwork
              <input
                className="photo-upload"
                type="file"
                onChange={handleFileChange}
                id="file-input"
              />
              {photoError && <div className="error">{photoError}</div>}
              {photoSuccess && <div className="success">{photoSuccess}</div>}
            </label>
            <div className="bottom">
              <div className="buttons">
                <button className="btn">Post</button>
              </div>
              <div className="progress">
                  <div className="progress__fill" style={{width : (percentage)}}></div>
                  <span className="progress__text">{percentage/4}%</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

