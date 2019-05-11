import firebase from "firebase";
import "@firebase/firestore";

const config = {
  apiKey: "AIzaSyB7L6joG4nyg6XyOdKHKeJORVeaNtS326g",
  authDomain: "band-app-8da62.firebaseapp.com",
  databaseURL: "https://band-app-8da62.firebaseio.com",
  projectId: "band-app-8da62",
  storageBucket: "band-app-8da62.appspot.com",
  messagingSenderId: "1084918838624"
};

firebase.initializeApp(config);

export default firebase;
