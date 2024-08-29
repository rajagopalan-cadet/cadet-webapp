// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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


// Global variables to store trainer information
let trainerId = null;
let trainerRecordId = null;

// Function to check Salesforce records
async function checkSalesforceRecord(email) {
    const instanceUrl = "https://{{Instance URL}}"; // Replace with your Salesforce instance URL
    const queryUrl = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Official_Email__c/${email}`;
    
    try {
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer 00DC1000000P5Nt!AQEAQCOXWHeu5jg0wzYq1Qhn9kWK_EAE.8mpLW6I.42chhtBiPN_QT2G_21JjLm9Q_62Ovs2Od2o3qJ1itCbl7ffgribjvGT`, // Replace with your Salesforce access token
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching Salesforce record');
        }

        const data = await response.json();
      
      if (data.records.length === 0) {
            throw new Error('Error Authenticating Certified Trainer: No records found');
        } else if (data.records.length > 1) {
            throw new Error('Contact Admin. Multiple trainers found with this email.');
        }
      
      const record = data.records[0];
      
        if (data.Certification_Status__c === 'Certified') {
            trainerId = data.CADET_Trainer_ID__c;
            trainerSalesforceId = data.Id;
            return true;
        } else {
           throw new Error('Error Authenticating Certified Trainer: User is not certified');
        }
    } catch (error) {
       console.error(error.message);
        // Log out the user if the check fails
        await signOut(auth);
        alert(error.message);
        return false;
    }
}



const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

       // Check Salesforce record for the authenticated user
        const isCertified = await checkSalesforceRecord(user.email);

        if (isCertified) {
            window.location.href = "https://app.cadetprogram.org/home";
        } else {
            // Error message and logout handled in checkSalesforceRecord
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error code: ${errorCode}, message: ${errorMessage}`);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "https://app.cadetprogram.org/home"
    } else {
        signInButton.style.display = "block";
    }
})

const signInButton = document.getElementById("signInButton");
signInButton.addEventListener('click', userSignIn);
