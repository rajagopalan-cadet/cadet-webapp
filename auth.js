import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADwHvTveDow6kx2cIjKnNuG7gYlsfzNWk",
    authDomain: "my-cadet-web-app.firebaseapp.com",
    projectId: "my-cadet-web-app",
    storageBucket: "my-cadet-web-app.appspot.com",
    messagingSenderId: "1094130867052",
    appId: "1:1094130867052:web:54157e132f5c7e64f1b149",
    measurementId: "G-8SJV2FFEJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication state listener
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not signed in, redirect to login page
        window.location.href = 'index.html';
    }
});
