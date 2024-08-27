document.getElementById('fetchButton').addEventListener('click', async function() {
    const prefix = document.getElementById('trainerIdPrefix').value;
    const numbers = document.getElementById('trainerIdNumbers').value;
    const trainerId = `${prefix}${numbers}`;

    if (!trainerId.match(/^CT-\d{3}$/)) {
        showErrorModal('Please enter a valid CADET Trainer ID (e.g., CT-123) with exactly 3 digits.');
        return;
    }

    // Show loader
    document.getElementById('loader').style.display = 'flex';

    try {
        const token = '00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU'; // Hard-coded token
        await fetchDetails(trainerId, token);
    } catch (error) {
        console.error('Error fetching details:', error);
    } finally {
        // Hide loader
        document.getElementById('loader').style.display = 'none';
    }
});

async function fetchDetails(trainerId, token) {
    const url = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`;
    //const token = '00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayDetails(data);
        } else {
            console.error('Error fetching details:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeModal = document.getElementById('closeModal');

    errorMessage.textContent = message;
    modal.style.display = 'block';

    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}
function displayDetails(data) {
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('detailsSection').style.display = 'block';
    document.getElementById('actionButtons').style.display = 'block';

     // Basic Details
    document.getElementById('id').value = data.Id || '';
    document.getElementById('cadetTrainerId').value = data.CADET_Trainer_ID__c || '';
    document.getElementById('cadetOfficialEmail').value = data.CADET_Official_Email__c || '';
    document.getElementById('salutation').value = data.Salutation || '';
    document.getElementById('firstName').value = data.FirstName || '';
    document.getElementById('lastName').value = data.LastName || '';
    document.getElementById('birthdate').value = formatDate(data.Birthdate) || '';
    document.getElementById('gender').value = data.Gender__c || '';
    document.getElementById('emergencyContactName').value = data.Emergency_Contact_Name__c || '';
    document.getElementById('emergencyContactRelationship').value = data.Emergency_Contact_Relationship__c || '';
    document.getElementById('emergencyContactPhone').value = data.Emergency_Contact_Phone__c || '';

        // Contact Details
    document.getElementById('mailingStreet').value = data.Mailing_Street || '';
    document.getElementById('mailingCity').value = data.Mailing_City || '';
    document.getElementById('mailingState').value = data.Mailing_State || '';
    document.getElementById('mailingPostalCode').value = data.Mailing_Postal_Code || '';
    document.getElementById('mailingCountry').value = data.Mailing_Country || '';
    document.getElementById('mobilePhone').value = data.Mobile_Phone || '';
    document.getElementById('otherPhone').value = data.Other_Phone || '';
    document.getElementById('email').value = data.Email || '';
    document.getElementById('currentCity').value = data.Current_City || '';
    document.getElementById('state').value = data.State || '';
    document.getElementById('pinCode').value = data.Pin_Code || '';

      // CADET Details
    document.getElementById('isEXPAMember').value = data.Is_EXPAMember__c || '';
    document.getElementById('certificationStatus').value = data.Certification_Status__c || '';
    document.getElementById('ctop').value = data.CTOP__c || '';
    document.getElementById('numberOfCamps').value = data.Number_of_Camps__c || '';
    document.getElementById('numberOfCampsAsLeadTrainer').value = data.Number_of_Camps_as_Lead_Trainer__c || '';
    document.getElementById('numberOfCampsThisFY').value = data.Number_of_Camps_This_FY__c || '';

 // Professional Details
    document.getElementById('educationalQualification').value = data.Educational_Qualification__c || '';
    document.getElementById('collegeOtherInstitution').value = data.College_Or_Other_Institution__c || '';
    document.getElementById('yearOfDegreeCompletion').value = data.Year_of_Degree_Completion__c || '';
    document.getElementById('profession').value = data.Profession__c || '';
    document.getElementById('employerName').value = data.Employer_Name__c || '';
    document.getElementById('jobTitle').value = data.Job_Title__c || '';

    // Update NCC Details
document.getElementById('nccDirectorate').value = data.NCC_Directorate__c || '';
document.getElementById('nccDirectorateUnitEtc').value = data.NCC_Directorate_Unit__c || '';
document.getElementById('rdOtherCampDetails').value = data.RD_Other_Camp_Details__c || '';
document.getElementById('yepYear').value = data.YEP_Year__c || '';
document.getElementById('yepCountry').value = data.YEP_Country__c || '';
document.getElementById('nccaaMembershipNumber').value = data.NCCAA_Membership_Number__c || '';
document.getElementById('nccWing').value = data.NCC_Wing__c || '';
document.getElementById('jdJwSdSw').value = data.JD_JW_SD_SW__c ? data.JD_JW_SD_SW__c.split(',') : [];
document.getElementById('nccGroup').value = data.NCC_Group__c || '';
document.getElementById('nccCertificate').value = data.NCC_Certificate__c ? data.NCC_Certificate__c.split(',') : [];
document.getElementById('yearOfCompletionOfNCC').value = data.Year_of_Completion_of_NCC__c || '';
document.getElementById('yearsInNCC').value = data.Years_in_NCC__c || '';
document.getElementById('importantNccCamps').value = data.Important_NCC_Camps__c || '';
document.getElementById('achievementsInNcc').value = data.Achievements_in_NCC__c || '';
document.getElementById('rdCampYear').value = data.RD_Camp_Year__c || '';

// Update Social Details
document.getElementById('instagramID').value = data.Instagram_ID__c || '';
document.getElementById('facebookID').value = data.Facebook_ID__c || '';
document.getElementById('twitterID').value = data.Twitter_ID__c || '';
document.getElementById('linkedInURL').value = data.LinkedIn_URL__c || '';
document.getElementById('shortBio').value = data.Short_Bio__c || '';
document.getElementById('longBio').value = data.Long_Bio__c || '';

// Update Other Details
document.getElementById('tShirtSize').value = data.T_Shirt_Size__c || '';
document.getElementById('languagesKnown').value = data.Languages_Known__c || '';
document.getElementById('hobbiesAchievements').value = data.Hobbies_Achievements__c || '';
document.getElementById('foodPreference').value = data.Food_Preference__c || '';
document.getElementById('covidVaccinationStatus').value = data.COVID_Vaccination_Status__c || '';

window.onload = function() {
    document.getElementById('basicDetails').click(); // Replace 'basicDetailsTab' with the ID of your Basic Details tab
};


    document.getElementById('editButton').addEventListener('click', function() {
        toggleEditMode(true);
    });

    document.getElementById('cancelButton').addEventListener('click', function() {
        toggleEditMode(false);
        displayDetails(data); // Revert to original data
    });

    document.getElementById('saveButton').addEventListener('click', function() {
        updateDetails(data.Id);
    });
}

function toggleEditMode(editMode) {
    const readOnlyFields = document.querySelectorAll('.tabcontent input');
    readOnlyFields.forEach(field => {
        field.readOnly = !editMode; // Make fields editable or read-only
    });

    document.getElementById('editButton').style.display = editMode ? 'none' : 'inline';
    document.getElementById('saveButton').style.display = editMode ? 'inline' : 'none';
    document.getElementById('cancelButton').style.display = editMode ? 'inline' : 'none';
}

function updateDetails(salesforceId) {
    const url = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/${salesforceId}`;
    
    const updatedData = {
        // Gather updated fields from the form
        // Example: FieldName: document.getElementById('basicField').value
    };

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer 00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU`, // Replace with your actual token
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Details updated successfully');
        displayDetails(data);
    })
    .catch(error => console.error('Error updating details:', error));
}

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}
