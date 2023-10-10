import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";


// firebase.initializeApp(config);

// export default firebase;

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDPIJwFUJSxAak1rJsDS2brUAE2i-HqI2c",
    authDomain: "zaramax-capital.firebaseapp.com",
    projectId: "zaramax-capital",
    storageBucket: "zaramax-capital.appspot.com",
    messagingSenderId: "321849221177",
    appId: "1:321849221177:web:d3aed469534cd79785ade8",
    measurementId: "G-CLS13TQW8E",
    databaseURL: "https://zaramax-capital-default-rtdb.firebaseio.com",
};

// const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;
firebase.initializeApp(firebaseConfig);

export default firebase;