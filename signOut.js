const signOutButton = document.getElementById("signOutButton");

const userSignOut = async () => {
    try {
        await signOut(auth);
        alert("You have Signed Out!");
    } catch (error) {
        console.error("Error signing out: ", error);
    }
}
onAuthStateChanged(auth, (user) => {
    if (user) {

    } else {
 window.location.href = "https://app.cadetprogram.org/index"
    }
})
signOutButton.addEventListener('click', userSignOut);
