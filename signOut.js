import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Function to handle sign-out
const userSignOut = async () => {
    signOut(auth)
    .then(() => {
        alert("You have signed out!");
        // Optionally, redirect to a login page after sign-out
        window.location.href = "https://app.cadetprogram.org/index";
    })
    .catch((error) => {
        console.log("Error signing out:", error.message);
    });
};

// Attach event listener to sign-out button
document.addEventListener('DOMContentLoaded', () => {
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', userSignOut);
    }
});
