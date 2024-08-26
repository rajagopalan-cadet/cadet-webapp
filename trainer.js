// Ensure config.js is included before this script to make instanceUrl and accessToken available
document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners to buttons
    document.querySelector("button[onclick='fetchTrainerDetails()']").addEventListener("click", fetchTrainerDetails);
    document.querySelector("button[onclick='editDetails()']").addEventListener("click", editDetails);
    document.getElementById("saveButton").addEventListener("click", saveDetails);
});

async function fetchTrainerDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`; // Use the correct URL

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const trainer = response.data;

        if (trainer) {
            document.getElementById("firstname").value = trainer.FirstName;
            document.getElementById("lastname").value = trainer.LastName;
            document.getElementById("Email").value = trainer.Email;

            // Enable the fields and show the Save button
            document.getElementById("firstname").disabled = false;
            document.getElementById("lastname").disabled = false;
            document.getElementById("Email").disabled = false;
            document.getElementById("saveButton").style.display = 'inline';
        } else {
            alert("No trainer found with the given ID.");
        }
    } catch (error) {
        console.error("Error fetching trainer details:", error);
        alert("Error fetching trainer details. Check the console for details.");
    }
}

function editDetails() {
    document.getElementById("firstname").disabled = false;
    document.getElementById("lastname").disabled = false;
    document.getElementById("Email").disabled = false;
    document.getElementById("saveButton").style.display = 'inline';
}

async function saveDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const updatedData = {
        FirstName: document.getElementById("firstname").value,
        LastName: document.getElementById("lastname").value,
        Email: document.getElementById("Email").value
    };

    // Use the correct URL for updating the record
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`; 

    try {
        await axios.patch(url, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        alert("Trainer details updated successfully!");
        document.getElementById("saveButton").style.display = 'none';
        document.getElementById("firstname").disabled = true;
        document.getElementById("lastname").disabled = true;
        document.getElementById("Email").disabled = true;
    } catch (error) {
        console.error("Error saving trainer details:", error);
        alert("Error saving trainer details. Check the console for details.");
    }
}
