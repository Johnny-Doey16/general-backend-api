import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";


// firebase.initializeApp(config);

// export default firebase;

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEASUREMENT_ID,
    databaseURL: process.env.FB_DB_URL,
};

// const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;
firebase.initializeApp(firebaseConfig);

export default firebase;