import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";


// firebase.initializeApp(config);

// export default firebase;

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDeHf_8h_jgHijXeHXl5JJTPew40Ul3dso",
    authDomain: "kfoods-d1ea0.firebaseapp.com",
    projectId: "kfoods-d1ea0",
    storageBucket: "kfoods-d1ea0.appspot.com",
    messagingSenderId: "411278206754",
    appId: "1:411278206754:web:26227573132abea79a677b",
    measurementId: "G-CLS13TQW8E",
    databaseURL: "https://kfoods-d1ea0-default-rtdb.firebaseio.com",
};

// const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;
firebase.initializeApp(firebaseConfig);

export default firebase;