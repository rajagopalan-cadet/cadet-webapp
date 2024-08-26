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

async function fetchTrainerDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`; // Replace Contact with your Salesforce object name

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const trainer = response.data;
        document.getElementById("trainerName").value = trainer.Name;
        document.getElementById("trainerEmail").value = trainer.Email__c; // Adjust field names based on your Salesforce object

        // Enable the fields and show the Save button
        document.getElementById("trainerName").disabled = false;
        document.getElementById("trainerEmail").disabled = false;
        document.getElementById("saveButton").style.display = 'inline';
    } catch (error) {
        console.error("Error fetching trainer details:", error);
        alert("Error fetching trainer details. Check the console for details.");
    }
}

function editDetails() {
    document.getElementById("trainerName").disabled = false;
    document.getElementById("trainerEmail").disabled = false;
    document.getElementById("saveButton").style.display = 'inline';
}

async function saveDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const updatedData = {
        Name: document.getElementById("trainerName").value,
        Email__c: document.getElementById("trainerEmail").value // Adjust field names based on your Salesforce object
    };

    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`; // Replace Contact with your Salesforce object name

    try {
        const response = await axios.patch(url, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        alert("Trainer details updated successfully!");
        document.getElementById("saveButton").style.display = 'none';
        document.getElementById("firstname").disabled = true;
        document.getElementById("lastname").disabled = true;
        document.getElementById("email").disabled = true;
    } catch (error) {
        console.error("Error saving trainer details:", error);
        alert("Error saving trainer details. Check the console for details.");
    }
}
