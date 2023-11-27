// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyD_Ys_BbDLEoAuSZgAxY0snLtx9QLWGmjY",
	authDomain: "intelligent-tracking-bd500.firebaseapp.com",
	databaseURL: "https://intelligent-tracking-bd500-default-rtdb.firebaseio.com",
	projectId: "intelligent-tracking-bd500",
	storageBucket: "intelligent-tracking-bd500.appspot.com",
	messagingSenderId: "548578763677",
	appId: "1:548578763677:web:cc568b5d521c928a090574",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
