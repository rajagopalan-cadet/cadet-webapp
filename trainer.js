async function fetchTrainerDetails() {
    const trainerId = document.getElementById('trainerId').value;
    const pattern = /^CT-\d{3}$/;

    if (!pattern.test(trainerId)) {
        alert('Please enter a valid CADET Trainer ID in the format CT-123');
        return;
    }

    try {
        const response = await fetch(`https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/${trainerId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 00DC1000000P5Nt!AQEAQNUUA.dEjoN9ZqW4pvLVB45E.TN_6YEwdJOryaZqQXRowYL.FhnHPKkJmHtCUj9MY173jJD0.wd9YbRCn8bkIOW.G7WA', // Replace with a secure method to handle tokens
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch trainer details: ${response.statusText}`);
        }

        const data = await response.json();
        populateFields(data);
    } catch (error) {
        console.error('Error fetching trainer details:', error);
        alert('There was an error fetching the trainer details. Please try again.');
    }
}

function populateFields(data) {
    document.getElementById('cadetTrainerId').value = data.CADET_Trainer_ID__c || '';
    document.getElementById('cadetOfficialEmail').value = data.CADET_Official_Email__c || '';
    document.getElementById('salutation').value = data.Salutation || '';
    document.getElementById('firstName').value = data.FirstName || '';
    document.getElementById('lastName').value = data.LastName || '';
    document.getElementById('birthdate').value = data.Birthdate || '';
    document.getElementById('gender').value = data.Gender__c || '';
    document.getElementById('mobilePhone').value = data.MobilePhone || '';
    document.getElementById('otherPhone').value = data.OtherPhone || '';
    document.getElementById('email').value = data.Email || '';
    document.getElementById('educationalQualification').value = data.Educational_Qualification__c || '';
    document.getElementById('mailingStreet').value = data.MailingStreet || '';
    document.getElementById('mailingPostalCode').value = data.MailingPostalCode || '';
    document.getElementById('mailingCountry').value = data.MailingCountry || '';
    document.getElementById('currentCity').value = data.Current_City__c || '';
    document.getElementById('state').value = data.State__c || '';
    document.getElementById('certificationStatus').value = data.Certification_Status__c || '';
    document.getElementById('numberOfCampsThisFY').value = data.Number_of_Camps_This_FY__c || '';
    document.getElementById('numberOfCamps').value = data.Number_of_Camps__c || '';
    document.getElementById('numberOfCampsAsLeadTrainer').value = data.Number_of_Camps_as_Lead_Trainer__c || '';
    document.getElementById('profession').value = data.Profession__c || '';
    document.getElementById('employerName').value = data.Employer_Name__c || '';
    document.getElementById('jobTitle').value = data.Job_Title__c || '';
    document.getElementById('nccDirectorateUnitEtc').value = data.NCC_Directorate_Unit_Etc__c || '';
    document.getElementById('nccDirectorate').value = data.NCC_Directorate__c || '';
    document.getElementById('nccWing').value = data.NCC_Wing__c || '';
    document.getElementById('yepYear').value = data.YEP_Year__c || '';
    document.getElementById('yepCountry').value = data.YEP_Country__c || '';
    document.getElementById('nccaaMembershipNumber').value = data.NCCAA_Membership_Number__c || '';

    // Enable fields for editing
    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(el => el.disabled = false);
    document.getElementById('editButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'inline';
    document.getElementById('saveButton').style.display = 'inline';
}

function editMode() {
    // Enable all fields for editing
    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(el => el.disabled = false);
    document.getElementById('editButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'inline';
    document.getElementById('saveButton').style.display = 'inline';
}

function cancelEdit() {
    // Disable all fields and reset values
    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(el => el.disabled = true);
    document.getElementById('editButton').style.display = 'inline';
    document.getElementById('cancelButton').style.display = 'none';
    document.getElementById('saveButton').style.display = 'none';

    // Optionally, reset fields to initial values or previously fetched values
}

async function saveChanges() {
    const trainerId = document.getElementById('trainerId').value;
    const data = {
        CADET_Trainer_ID__c: document.getElementById('cadetTrainerId').value,
        CADET_Official_Email__c: document.getElementById('cadetOfficialEmail').value,
        Salutation: document.getElementById('salutation').value,
        FirstName: document.getElementById('firstName').value,
        LastName: document.getElementById('lastName').value,
        Birthdate: document.getElementById('birthdate').value,
        Gender__c: document.getElementById('gender').value,
        MobilePhone: document.getElementById('mobilePhone').value,
        OtherPhone: document.getElementById('otherPhone').value,
        Email: document.getElementById('email').value,
        Educational_Qualification__c: document.getElementById('educationalQualification').value,
        MailingStreet: document.getElementById('mailingStreet').value,
        MailingPostalCode: document.getElementById('mailingPostalCode').value,
        MailingCountry: document.getElementById('mailingCountry').value,
        Current_City__c: document.getElementById('currentCity').value,
        State__c: document.getElementById('state').value,
        Certification_Status__c: document.getElementById('certificationStatus').value,
        Number_of_Camps_This_FY__c: document.getElementById('numberOfCampsThisFY').value,
        Number_of_Camps__c: document.getElementById('numberOfCamps').value,
        Number_of_Camps_as_Lead_Trainer__c: document.getElementById('numberOfCampsAsLeadTrainer').value,
        Profession__c: document.getElementById('profession').value,
        Employer_Name__c: document.getElementById('employerName').value,
        Job_Title__c: document.getElementById('jobTitle').value,
        NCC_Directorate_Unit_Etc__c: document.getElementById('nccDirectorateUnitEtc').value,
        NCC_Directorate__c: document.getElementById('nccDirectorate').value,
        NCC_Wing__c: document.getElementById('nccWing').value,
        YEP_Year__c: document.getElementById('yepYear').value,
        YEP_Country__c: document.getElementById('yepCountry').value,
        NCCAA_Membership_Number__c: document.getElementById('nccaaMembershipNumber').value
    };

    try {
        const response = await fetch(`https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/${trainerId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer 00DC1000000P5Nt!AQEAQNUUA.dEjoN9ZqW4pvLVB45E.TN_6YEwdJOryaZqQXRowYL.FhnHPKkJmHtCUj9MY173jJD0.wd9YbRCn8bkIOW.G7WA', // Replace with a secure method to handle tokens
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to save changes: ${response.statusText}`);
        }

        alert('Changes saved successfully!');
        cancelEdit();
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('There was an error saving the changes. Please try again.');
    }
}
