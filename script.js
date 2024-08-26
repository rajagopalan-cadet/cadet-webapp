// This function will be triggered when the button is clicked
function showMessage() {
    alert("Hello! You clicked the button!");
}
// Listen for the form submission
document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the input values
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;

    // Display the user's details
    const userDetails = `First Name: ${firstname}<br> Last Name: ${lastname}<br>Email: ${email}`;
    document.getElementById("userDetails").innerHTML = userDetails;

    // Clear the form inputs
    document.getElementById("userForm").reset();
});

const accessToken = '00DC1000000P5Nt!AQEAQJUAT7njCVqFrjx_dwnH93f3jNcsSJjISLGTj53xj_FNknSmIDp2RVffNzruE7c4y3xr_1iUzBANkrvS79yCfVlt7eVZ'; // Replace with your actual access token
const instanceUrl = 'https://cadetprogram--charcoal.sandbox.my.salesforce.com'; // Replace with your actual instance URL

async function createRecord() {
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/`; // API endpoint for Contact
    const recordData = {
        First Name: document.getElementById("firstname").value,
        Last Name: document.getElementById("lastame").value,
        Email: document.getElementById("email").value
    };

    try {
        const response = await axios.post(url, recordData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Record created:", response.data);
        alert("Record successfully created in Salesforce!");
    } catch (error) {
        console.error("Error creating record:", error.response ? error.response.data : error.message);
        alert("There was an error creating the record. Please check the console for details.");
    }
}


document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    createRecord(); // Call the function to create a record in Salesforce
});
