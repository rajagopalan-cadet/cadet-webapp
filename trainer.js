document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners to buttons
    document.querySelector("button[onclick='fetchTrainerDetails()']").addEventListener("click", fetchTrainerDetails);
    document.querySelector("button[onclick='editDetails()']").addEventListener("click", editDetails);
    document.getElementById("saveButton").addEventListener("click", saveDetails);
});

async function fetchTrainerDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const url = `${instanceUrl}/services/data/v52.0/query?q=SELECT Id, FirstName, LastName, Email FROM Contact WHERE CADET_Trainer_ID__c = '${trainerId}'`; // SOQL query

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const records = response.data.records;

        if (records.length > 0) {
            const trainer = records[0];
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

    // Use a query to get the ID of the Contact with the external ID
    const query = `SELECT Id FROM Contact WHERE CADET_Trainer_ID__c = '${trainerId}'`;
    const queryUrl = `${instanceUrl}/services/data/v52.0/query?q=${encodeURIComponent(query)}`;

    try {
        const queryResponse = await axios.get(queryUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const records = queryResponse.data.records;

        if (records.length > 0) {
            const recordId = records[0].Id;
            const updateUrl = `${instanceUrl}/services/data/v52.0/sobjects/Contact/${recordId}`;

            await axios.patch(updateUrl, updatedData, {
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
        } else {
            alert("No trainer found with the given ID.");
        }
    } catch (error) {
        console.error("Error saving trainer details:", error);
        alert("Error saving trainer details. Check the console for details.");
    }
}
