document.addEventListener("DOMContentLoaded", function() {
    const fetchButton = document.getElementById("fetchButton");
    const editButton = document..getElementById("editButton"));
    const saveButton = document.getElementById("saveButton");
    const cancelButton = document.getElementById("cancelButton");

    if (fetchButton) {
        fetchButton.addEventListener("click", fetchTrainerDetails);
    } else {
        console.error("Fetch button not found.");
    }

    if (editButton) {
        editButton.addEventListener("click", editDetails);
    } else {
        console.error("Edit button not found.");
    }

    if (saveButton) {
        saveButton.addEventListener("click", saveDetails);
    } else {
        console.error("Save button not found.");
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelEdit);
    } else {
        console.error("Cancel button not found.");
    }

    populateSelectOptions(); // Populate select options on load
});

async function fetchTrainerDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/${trainerId}`; // Correct URL

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const trainer = response.data;

        if (trainer) {
            // Populate fields with fetched data
            document.getElementById("salutation").value = trainer.Salutation || '';
            document.getElementById("mailingStreet").value = trainer.MailingStreet || '';
            document.getElementById("mailingPostalCode").value = trainer.MailingPostalCode || '';
            document.getElementById("mailingCountry").value = trainer.MailingCountry || '';
            document.getElementById("mobilePhone").value = trainer.MobilePhone || '';
            document.getElementById("otherPhone").value = trainer.OtherPhone || '';
            document.getElementById("birthdate").value = trainer.Birthdate || '';
            document.getElementById("nccDirectorateUnitEtc").value = trainer.NCC_Directorate_Unit_Etc__c || '';
            document.getElementById("nccDirectorate").value = trainer.NCC_Directorate__c || '';
            document.getElementById("educationalQualification").value = trainer.Educational_Quaification__c || '';
            document.getElementById("gender").value = trainer.Gender__c || '';
            document.getElementById("yepYear").value = trainer.YEP_Year__c || '';
            document.getElementById("yepCountry").value = trainer.YEP_Country__c || '';
            document.getElementById("profession").value = trainer.Profession__c || '';
            document.getElementById("nccaaMembershipNumber").value = trainer.NCCAA_Membership_Number__c || '';
            document.getElementById("nccWing").value = trainer.NCC_Wing__c || '';
            document.getElementById("cadetTrainerId").value = trainer.CADET_Trainer_ID__c || '';
            document.getElementById("isExpamember").value = trainer.Is_EXPA_Member__c || '';
            document.getElementById("certificationStatus").value = trainer.Certification_Status__c || '';
            document.getElementById("cadetOfficialEmail").value = trainer.CADET_Official_Email__c || '';
            document.getElementById("currentCity").value = trainer.Current_City__c || '';
            document.getElementById("state").value = trainer.State__c || '';
            document.getElementById("employerName").value = trainer.Employer_Name__c || '';
            document.getElementById("jobTitle").value = trainer.Job_Title__c || '';
            document.getElementById("numberOfCamps").value = trainer.Number_of_Camps__c || '';
            document.getElementById("numberOfCampsAsLeadTrainer").value = trainer.Number_of_Camps_as_Lead_Trainer__c || '';
            document.getElementById("numberOfCampsThisFY").value = trainer.Number_of_Camps_this_FY__c || '';
            document.getElementById("firstname").value = trainer.FirstName || '';
            document.getElementById("lastname").value = trainer.LastName || '';

            // Make fields read-only initially
            document.querySelectorAll('#trainerDetails input').forEach(input => input.disabled = true);

            // Make fields non-editable where needed
            document.getElementById("cadetTrainerId").disabled = true;
            document.getElementById("cadetOfficialEmail").disabled = true;
            document.getElementById("isExpamember").disabled = true;
            document.getElementById("certificationStatus").disabled = true;
            document.getElementById("currentCity").disabled = true;
            document.getElementById("state").disabled = true;
            document.getElementById("employerName").disabled = true;
            document.getElementById("jobTitle").disabled = true;

            // Show the Save button
            document.getElementById("saveButton").style.display = 'none';
            document.getElementById("cancelButton").style.display = 'none'; // Hide cancel button initially
        } else {
            alert("No trainer found with the given ID.");
        }
    } catch (error) {
        console.error("Error fetching trainer details:", error);
        alert("Error fetching trainer details. Check the console for details.");
    }
}

function editDetails() {
    document.querySelectorAll('#trainerDetails input').forEach(input => input.disabled = false);
    document.getElementById("saveButton").style.display = 'inline';
    document.getElementById("cancelButton").style.display = 'inline'; // Show cancel button
}

function cancelEdit() {
    fetchTrainerDetails(); // Re-fetch the details to revert any changes
    document.getElementById("saveButton").style.display = 'none';
    document.getElementById("cancelButton").style.display = 'none'; // Hide cancel button
}

function validateForm() {
    const gender = document.getElementById("gender").value;
    const birthdate = document.getElementById("birthdate").value;
    const email = document.getElementById("cadetOfficialEmail").value;
    const phone = document.getElementById("mobilePhone").value;

    // Validate gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
        alert('Invalid gender value.');
        return false;
    }

    // Validate birthdate
    if (!birthdate) {
        alert('Birthdate is required.');
        return false;
    }

    // Validate email
    const emailRegex = /^[\w.-]+@(gmail\.com|cadetprogram\.org)$/;
    if (!emailRegex.test(email)) {
        alert('Email must be @gmail.com or @cadetprogram.org.');
        return false;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Mobile phone must be exactly 10 digits.');
        return false;
    }

    return true;
}

async function saveDetails() {
    if (!validateForm()) {
        return;
    }

    const trainerId = document.getElementById("trainerId").value;
    const updatedData = {
        Salutation: document.getElementById("salutation").value,
        MailingStreet: document.getElementById("mailingStreet").value,
        MailingPostalCode: document.getElementById("mailingPostalCode").value,
        MailingCountry: document.getElementById("mailingCountry").value,
        MobilePhone: document.getElementById("mobilePhone").value,
        OtherPhone: document.getElementById("otherPhone").value,
        Birthdate: document.getElementById("birthdate").value,
        NCC_Directorate_Unit_Etc__c: document.getElementById("nccDirectorateUnitEtc").value,
        NCC_Directorate__c: document.getElementById("nccDirectorate").value,
        Educational_Quaification__c: document.getElementById("educationalQualification").value,
        Gender__c: document.getElementById("gender").value,
        YEP_Year__c: document.getElementById("yepYear").value,
        YEP_Country__c: document.getElementById("yepCountry").value,
        Profession__c: document.getElementById("profession").value,
        NCCAA_Membership_Number__c: document.getElementById("nccaaMembershipNumber").value,
        NCC_Wing__c: document.getElementById("nccWing").value,
        CADET_Trainer_ID__c: document.getElementById("cadetTrainerId").value,
        Is_EXPA_Member__c: document.getElementById("isExpamember").value,
        Certification_Status__c: document.getElementById("certificationStatus").value,
        CADET_Official_Email__c: document.getElementById("cadetOfficialEmail").value,
        Current_City__c: document.getElementById("currentCity").value,
        State__c: document.getElementById("state").value,
        Employer_Name__c: document.getElementById("employerName").value,
        Job_Title__c: document.getElementById("jobTitle").value,
        Number_of_Camps__c: document.getElementById("numberOfCamps").value,
        Number_of_Camps_as_Lead_Trainer__c: document.getElementById("numberOfCampsAsLeadTrainer").value,
        Number_of_Camps_this_FY__c: document.getElementById("numberOfCampsThisFY").value,
        FirstName: document.getElementById("firstname").value,
        LastName: document.getElementById("lastname").value,
    };

    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/${trainerId}`; // Correct URL

    try {
        const response = await axios.patch(url, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 204) {
            alert("Details updated successfully.");
            document.getElementById("saveButton").style.display = 'none';
            document.getElementById("cancelButton").style.display = 'none'; // Hide cancel button
        } else {
            alert("Error updating details.");
        }
    } catch (error) {
        console.error("Error updating details:", error);
        alert("Error updating details. Check the console for details.");
    }
}

function populateSelectOptions() {
    const nccDirectorate = document.getElementById("nccDirectorate");
    const nccWing = document.getElementById("nccWing");
    const yepCountry = document.getElementById("yepCountry");

    if (nccDirectorate) {
        const directorates = ["Andhra Pradesh", "Bihar & Jharkhand", "Delhi", "Gujarat", "Diu Daman & Dadra & Nagar Haveli", "Jammu & Kashmir", "Karnataka & Goa", "Kerala & Lakshadweep", "Madhya Pradesh & Chattishgarh", "Maharashtra", "North Eastern Region", "Orissa", "Punjab", "Haryana", "Himachal Pradesh & Chandigarh", "Rajasthan", "Tamil Nadu", "Pondicherry and Andaman & Nicobar Islands", "Uttar Pradesh", "Uttarakhand", "West Bengal & Sikkim"];
        directorates.forEach(directorate => {
            const option = document.createElement("option");
            option.value = directorate;
            option.textContent = directorate;
            nccDirectorate.appendChild(option);
        });
    }

    if (nccWing) {
        const wings = ["Army", "Navy", "Air Force"];
        wings.forEach(wing => {
            const option = document.createElement("option");
            option.value = wing;
            option.textContent = wing;
            nccWing.appendChild(option);
        });
    }

    if (yepCountry) {
        const countries = ["USA", "UK", "Canada", "Bangladesh", "Naval Cruise", "Singapore", "Maldives", "Russia", "Vietnam", "Sri Lanka", "Nepal", "Bhutan", "China", "Khazakstan"];
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            yepCountry.appendChild(option);
        });
    }
}
