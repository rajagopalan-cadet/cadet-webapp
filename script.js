// Listen for the form submission
document.getElementById("userForm").addEventListener("submit", async function(event) {
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

    // Now create the Salesforce record
   
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/`; // API endpoint for Contact
    const recordData = {
        FirstName: firstname,
        LastName: lastname,
        Email: email
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
});
