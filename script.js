// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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
const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");



const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error code: ${errorCode}, message: ${errorMessage}`);
    }
}

const userSignOut = async () => {
    try {
        await signOut(auth);
        alert("You have Signed Out!");
        window.location.href = "https://app.cadetprogram.org/index"
    } catch (error) {
        console.error("Error signing out: ", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "https://app.cadetprogram.org/home"
    } else {
        signInButton.style.display = "block";
    }
})

signInButton.addEventListener('click', userSignIn);
