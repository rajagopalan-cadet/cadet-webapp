document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("button[onclick='fetchTrainerDetails()']").addEventListener("click", fetchTrainerDetails);
    document.querySelector("button[onclick='editDetails()']").addEventListener("click", editDetails);
    document.getElementById("saveButton").addEventListener("click", saveDetails);
});

async function fetchTrainerDetails() {
    const trainerId = document.getElementById("trainerId").value;
    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`; // Correct URL

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
            document.getElementById("salutation").value = trainer.Salutation;
            document.getElementById("mailingStreet").value = trainer.MailingStreet;
            document.getElementById("mailingPostalCode").value = trainer.MailingPostalCode;
            document.getElementById("mailingCountry").value = trainer.MailingCountry;
            document.getElementById("mobilePhone").value = trainer.MobilePhone;
            document.getElementById("otherPhone").value = trainer.OtherPhone;
            document.getElementById("birthdate").value = trainer.Birthdate;
            document.getElementById("nccDirectorateUnitEtc").value = trainer.NCC_Directorate_Unit_Etc__c;
            document.getElementById("nccDirectorate").value = trainer.NCC_Directorate__c;
            document.getElementById("educationalQualification").value = trainer.Educational_Quaification__c;
            document.getElementById("gender").value = trainer.Gender__c;
            document.getElementById("yepYear").value = trainer.YEP_Year__c;
            document.getElementById("yepCountry").value = trainer.YEP_Country__c;
            document.getElementById("profession").value = trainer.Profession__c;
            document.getElementById("nccaaMembershipNumber").value = trainer.NCCAA_Membership_Number__c;
            document.getElementById("nccWing").value = trainer.NCC_Wing__c;
            document.getElementById("cadetTrainerId").value = trainer.CADET_Trainer_ID__c;
            document.getElementById("isExpamember").value = trainer.Is_EXPA_Member__c;
            document.getElementById("certificationStatus").value = trainer.Certification_Status__c;
            document.getElementById("cadetOfficialEmail").value = trainer.CADET_Official_Email__c;
            document.getElementById("currentCity").value = trainer.Current_City__c;
            document.getElementById("state").value = trainer.State__c;
            document.getElementById("employerName").value = trainer.Employer_Name__c;
            document.getElementById("jobTitle").value = trainer.Job_Title__c;
            document.getElementById("numberOfCamps").value = trainer.Number_of_Camps__c;
            document.getElementById("numberOfCampsAsLeadTrainer").value = trainer.Number_of_Camps_as_Lead_Trainer__c;
            document.getElementById("numberOfCampsThisFY").value = trainer.Number_of_Camps_this_FY__c;
            document.getElementById("firstname").value = trainer.FirstName;
            document.getElementById("lastname").value = trainer.LastName;
            

            // Make fields read-only initially
            document.querySelectorAll('#trainerDetails input').forEach(input => input.disabled = true);

            // Show the Save button
            document.getElementById("saveButton").style.display = 'none';
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
}

async function saveDetails() {
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
        Number_of_Camps_this_FY__c: document.getElementById("numberOfCampsThisFY").value
    };

    const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/${trainerId}`; // Use Salesforce ID

    try {
        const response = await axios.patch(url, updatedData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        alert("Trainer details updated successfully!");
        document.getElementById("saveButton").style.display = 'none';
        document.querySelectorAll('#trainerDetails input').forEach(input => input.disabled = true);
    } catch (error) {
        console.error("Error saving trainer details:", error);
        alert("Error saving trainer details. Check the console for details.");
    }
}
