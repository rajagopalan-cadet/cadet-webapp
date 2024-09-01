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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account' // Forces the user to choose an account or re-authenticate
});


// Global variables to store trainer information
let trainerId = null;
let trainerRecordId = null;
let salesforceToken = null;
// URL for your Google Cloud Function
const fetchSalesforceTokenUrl = 'https://us-central1-my-cadet-web-app.cloudfunctions.net/fetchSalesforceToken';

// Function to check Salesforce records
async function checkSalesforceRecord(email) {
    const instanceUrl = "https://cadetprogram--charcoal.sandbox.my.salesforce.com"; // Replace with your Salesforce instance URL
    const queryUrl = `${instanceUrl}/services/data/v52.0/query/?q=SELECT+CADET_Trainer_ID__c,Id,Certification_Status__c+FROM+Contact+WHERE+CADET_Official_Email__c='${encodeURIComponent(email)}'`;

    // Retrieve the Salesforce token from sessionStorage
    salesforceToken = sessionStorage.getItem('salesforceToken');

    if (!salesforceToken) {
        console.error('Salesforce token not found');
        await signOut(auth);
        alert('Error Authenticating Certified Trainer: Please sign in using official CADET Trainer Email ID.');
        return false;
    }
    
    try {
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${salesforceToken}`, // Replace with your Salesforce access token
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 404) {
            throw new Error('Error Authenticating Certified Trainer: No records found');
        }

        if (response.status === 300) {
            throw new Error('Contact Admin. Multiple trainers found with this email.');
        }

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

        if (record.Certification_Status__c === 'Certified') {
            trainerId = record.CADET_Trainer_ID__c;
            trainerRecordId = record.Id;

            // Store in localStorage or sessionStorage
    sessionStorage.setItem('trainerId', trainerId);
    sessionStorage.setItem('trainerRecordId', trainerRecordId);

            return true;
        } else {
            throw new Error('Error Authenticating Certified Trainer: User is not certified');
        }
    } catch (error) {
        console.error(error.message);
        await signOut(auth);
        alert(error.message);
        return false;
    }
}


// Function to handle user sign-in
const userSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const token = await fetchSalesforceToken();
        sessionStorage.setItem('salesforceToken', token);
        
        const isCertified = await checkSalesforceRecord(user.email);

        if (isCertified) {
            window.location.href = "https://app.cadetprogram.org/home";
        }
    } catch (error) {
      
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error code: ${errorCode}, message: ${errorMessage}`);
    }
}

function handleSignOut() {
    signOut(auth).then(() => {
        console.log('User signed out');
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Sign-out error:', error);
    });
}

// Handle auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchSalesforceToken().then(token => {
            // Store the Salesforce token in a session variable
            sessionStorage.setItem('salesforceToken', token);

        checkSalesforceRecord(user.email).then(isCertified => {
                if (!isCertified) {
                    signOut(auth);
                }
            }).catch(() => {
                signOut(auth);
            });
        }).catch(() => {
            signOut(auth);
        });
    } else {
        document.getElementById('signInButton').style.display = "block";
    }
})

async function fetchSalesforceToken() {
    try {
        const response = await fetch(fetchSalesforceTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Contact Admin. Cloud Function Failed.');
        }

        const data = await response.json();
        return data.access_token; // Assuming the function returns { salesforceToken: 'token' }
    } catch (error) {
        console.error('Error calling fetchSalesforceToken', error);
        throw error;
    }
}

// Attach event listener to the sign-in button
document.addEventListener('DOMContentLoaded', () => {
    const signInButton = document.getElementById('signInButton');
    if (signInButton) {
        signInButton.addEventListener('click', userSignIn);
    }
    
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', handleSignOut);
    }
});

