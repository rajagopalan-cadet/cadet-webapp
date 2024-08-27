
async function fetchTrainerDetails() {
    
    document.getElementById('editButton').style.display = 'inline-block';
    document.getElementById('saveButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'none';
    
    const trainerId = document.getElementById('trainerId').value;
    const pattern = /^CT-\d{3}$/;

    if (!pattern.test(trainerId)) {
        alert('Please enter a valid CADET Trainer ID in the format CT-123');
        return;
    }

    try {
        const response = await fetch(`https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU', // Replace with a secure method to handle tokens
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = `Error ${response.errorCode}: ${response.message}`;
            if (response.status === 401) {
                errorMessage += ` - ${errorData.errorCode || 'Unauthorized access or Session Expired'}`;
            }
            alert(errorMessage);
            return;
        }

        const data = await response.json();
        salesforceId = data.Id;
        populateFields(data);
    } catch (error) {
        console.error('Error fetching trainer details:', error);
        alert('There was an error fetching the trainer details. Please try again.');
    }
    
}

function populateFields(data) {
    const fields = {
        salesforceId: data.Id,
        cadetTrainerId: data.CADET_Trainer_ID__c,
        cadetOfficialEmail: data.CADET_Official_Email__c,
        salutation: data.Salutation,
        firstName: data.FirstName,
        lastName: data.LastName,
        birthdate: data.Birthdate,
        gender: data.Gender__c,
        mobilePhone: data.MobilePhone,
        otherPhone: data.OtherPhone,
        email: data.Email,
        educationalQualification: data.Educational_Qualification__c,
        mailingStreet: data.MailingStreet,
        mailingPostalCode: data.MailingPostalCode,
        mailingCountry: data.MailingCountry,
        currentCity: data.Current_City__c,
        state: data.State__c,
        certificationStatus: data.Certification_Status__c,
        numberOfCampsThisFY: data.Number_of_Camps_This_FY__c,
        numberOfCamps: data.Number_of_Camps__c,
        numberOfCampsAsLeadTrainer: data.Number_of_Camps_as_Lead_Trainer__c,
        profession: data.Profession__c,
        employerName: data.Employer_Name__c,
        jobTitle: data.Job_Title__c,
        nccDirectorateUnitEtc: data.NCC_Directorate_Unit_Etc__c,
        nccDirectorate: data.NCC_Directorate__c,
        nccWing: data.NCC_Wing__c,
        yepYear: data.YEP_Year__c,
        yepCountry: data.YEP_Country__c,
        nccaaMembershipNumber: data.NCCAA_Membership_Number__c
    };

    for (const [fieldId, fieldValue] of Object.entries(fields)) {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            fieldElement.value = fieldValue || '';
        } else {
            console.warn(`Element with ID ${fieldId} not found in the DOM.`);
        }
    }

    // Enable fields for editing (read-only mode initially)
    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(el => el.disabled = true);
    document.getElementById('editButton').style.display = 'inline';
    document.getElementById('cancelButton').style.display = 'none';
    document.getElementById('saveButton').style.display = 'none';
}

function editMode() {
    // Enable some fields for editing
// Enable only specified fields for editing
    const fieldsToEnable = [
        'cadetOfficialEmail', 'salutation', 'firstName', 'lastName', 'birthdate', 
        'gender', 'mobilePhone', 'otherPhone', 'email', 'educationalQualification', 
        'mailingStreet', 'mailingPostalCode', 'mailingCountry', 'currentCity', 
        'state', 'profession', 'employerName', 'jobTitle', 
        'nccDirectorateUnitEtc', 'nccDirectorate', 'nccWing', 'yepYear', 'yepCountry', 
        'nccaaMembershipNumber'
    ];
    document.querySelectorAll('#trainerDetails input, #trainerDetails select').forEach(el => {
        el.disabled = !fieldsToEnable.includes(el.id);
    }); 
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
    console.log('Salesforce ID:', salesforceId); // Debug log

    if (!salesforceId) {
        alert('No Salesforce ID found. Please fetch trainer details first.');
        return;
    }
    const data = {
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
        const response = await fetch(`https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/${salesforceId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer 00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU', // Replace with a secure method to handle tokens
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = `Error ${response.errorCode}: ${response.message}`;
            if (response.status === 401) {
                errorMessage += ` - ${errorData.message || 'Unauthorized access or Session Expired'}`;
            }
            alert(errorMessage);
            return;
        }

        alert('Changes saved successfully!');
        cancelEdit();
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('There was an error saving the changes. Please try again.');
    }
}
