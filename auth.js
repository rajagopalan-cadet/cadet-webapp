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

// Function to handle sign-out
function handleSignOut() {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('User signed out');
    // Redirect to the login page
    window.location.href = 'login.html'; // Adjust this URL as necessary
  }).catch((error) => {
    // An error happened.
    console.error('Sign-out error:', error);
  });
}

// Function to check if the user is authenticated
function checkAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      console.log('User is signed in:', user);
    } else {
      // No user is signed in.
      console.log('No user signed in');
      // Redirect to the login page
      window.location.href = 'login.html'; // Adjust this URL as necessary
    }
  });
}

// Add an event listener to the sign-out button
document.addEventListener('DOMContentLoaded', () => {
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', handleSignOut);
  }
  
  // Call checkAuth to restrict access on page load
  checkAuth();
});
