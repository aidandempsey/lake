import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"
import "firebase/storage"

const firebaseConfig = {
// PUT YOUR CONFIG HERE
};

  //init firebase
  firebase.initializeApp(firebaseConfig);

  //initialise services
  const projectFirestore = firebase.firestore();
  const projectAuth = firebase.auth();
  const projectStorage = firebase.storage();

  //timestamp
  const timestamp = firebase.firestore.Timestamp;

  export {projectFirestore, projectAuth, timestamp, projectStorage}