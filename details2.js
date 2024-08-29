    let data = {};
// Define global variables
let trainerId = null;
let trainerRecordId = null;

document.addEventListener('DOMContentLoaded', () => {
    const trainerId = sessionStorage.getItem('trainerId');
    const trainerRecordId = sessionStorage.getItem('trainerRecordId');

    if (trainerId || trainerRecordId) {
        console.log('Trainer ID:', trainerId);
        console.log('Trainer Record ID:', trainerRecordId);
         console.log('Trainer Details fetched from session');
        
        // You can add further logic here to use the retrieved values
    } else {
        console.log('No trainer information found in sessionStorage.');
    }
});



window.onload = function() {
    // Trigger click on the image link on page load
    if (trainerId && trainerId.match(/^CT-\d{3}$/)) {
       // Show loader
    document.getElementById('loader').style.display = 'flex';
      
        document.getElementById('fetchDetails').click();
    } else {
        console.error('Invalid or missing trainerId.');
    }
};

async function fetchDetails(trainerId) {
    const token = '00DC1000000P5Nt!AQEAQIVrkTQQGhW.prvhAHZ6EsAigBsxFhNN3nb26.jF8BC6J_9SzjSpKsYBkqTwXJlAlYlHJMdxoWL7erSi3HMol1JkDWZP'; // Hard-coded token
    const url = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            data = await response.json(); // Assign fetched data to global variable
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
    console.log('Display Data:', data);
    
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
    document.getElementById('birthdate').value = data.Birthdate || '';
    document.getElementById('gender').value = data.Gender__c || '';
    document.getElementById('emergencyContactName').value = data.Emergency_Contact_Name__c || '';
    document.getElementById('emergencyContactRelationship').value = data.Emergency_Contact_Relationship__c || '';
    document.getElementById('emergencyContactPhone').value = data.Emergency_Contact_Phone__c || '';

        // Contact Details
    document.getElementById('mailingStreet').value = data.MailingStreet || '';
    document.getElementById('mailingCity').value = data.MailingCity || '';
    document.getElementById('mailingState').value = data.MailingState || '';
    document.getElementById('mailingPostalCode').value = data.MailingPostalCode || '';
    document.getElementById('mailingCountry').value = data.MailingCountry || '';
    document.getElementById('mobilePhone').value = data.MobilePhone || '';
    document.getElementById('otherPhone').value = data.OtherPhone || '';
    document.getElementById('email').value = data.Email || '';
    document.getElementById('currentCity').value = data.Current_City__c || '';
    document.getElementById('state').value = data.State__c || '';
    document.getElementById('pinCode').value = data.Pin_Code__c || '';

      // CADET Details
    document.getElementById('isEXPAMember').value = data.Is_EXPA_Member__c || '';
    document.getElementById('certificationStatus').value = data.Certification_Status__c || '';
    document.getElementById('ctop').value = data.CTOP__c || '';
    document.getElementById('numberOfCamps').value = data.Number_of_Camps__c || '';
    document.getElementById('numberOfCampsAsLeadTrainer').value = data.Number_of_Camps_as_Lead_Trainer__c || '';
    document.getElementById('numberOfCampsThisFY').value = data.Number_of_Camps_this_FY__c || '';

 // Professional Details
    document.getElementById('educationalQualification').value = data.Educational_Qualification__c || '';
    document.getElementById('collegeOtherInstitution').value = data.College_Other_Institution__c || '';
    document.getElementById('yearOfDegreeCompletion').value = data.Year_of_Degree_Completion__c || '';
    document.getElementById('profession').value = data.Profession__c || '';
    document.getElementById('employerName').value = data.Employer_Name__c || '';
    document.getElementById('jobTitle').value = data.Job_Title__c || '';

    // Update NCC Details
document.getElementById('nccDirectorate').value = data.NCC_Directorate__c || '';
document.getElementById('nccDirectorateUnitEtc').value = data.NCC_Directorate_Unit_Etc__c || '';
document.getElementById('rdOtherCampDetails').value = data.RD_Other_Camp_Details__c || '';
document.getElementById('yepYear').value = data.YEP_Year__c || '';
document.getElementById('yepCountry').value = data.YEP_Country__c || '';
document.getElementById('nccaaMembershipNumber').value = data.NCCAA_Membership_Number__c || '';
document.getElementById('nccWing').value = data.NCC_Wing__c || '';
//document.getElementById('jdJwSdSw').value = data.JD_JW_SD_SW__c ? data.JD_JW_SD_SW__c.split(';') : [];
document.getElementById('nccGroup').value = data.NCC_Group__c || '';
//document.getElementById('nccCertificate').value = data.NCC_Certificate__c ? data.NCC_Certificate__c.split(';') : [];
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
document.getElementById('hobbiesAchievements').value = data.Hobbies_and_Achievements__c || '';
document.getElementById('foodPreference').value = data.Food_Preference__c || '';
document.getElementById('covidVaccinationStatus').value = data.COVID_Vaccination_Status__c || '';
        // Handle JD/JW/SD/SW Checkboxes
    const jdJwSdSwValues = data.JD_JW_SD_SW__c ? data.JD_JW_SD_SW__c.split(';') : [];
    document.querySelectorAll('input[name="jdJwSdSw"]').forEach(checkbox => {
        checkbox.checked = jdJwSdSwValues.includes(checkbox.value);
    });

    // Handle NCC Certificate Checkboxes
    const nccCertificateValues = data.NCC_Certificate__c ? data.NCC_Certificate__c.split(';') : [];
    document.querySelectorAll('input[name="nccCertificate"]').forEach(checkbox => {
        checkbox.checked = nccCertificateValues.includes(checkbox.value);
    });
};
function enableFields() {
        // Get all input and select elements inside the form containers
        const fieldIds = ['salutation', 'gender', 'emergencyContactRelationship', 'mailingState', 'mailingCountry','state','educationalQualification', 'nccDirectorate','yepCountry', 'nccWing', 'jdJwSdSw','nccCertificate','tShirtSize','foodPreference', 'covidVaccinationStatus'];
            
            fieldIds.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.removeAttribute('disabled');
                    field.removeAttribute('readonly');
                }
            });
    }
function disableFields() {
             const fieldIds = ['salutation', 'gender', 'emergencyContactRelationship', 'mailingState', 'mailingCountry','state','educationalQualification', 'nccDirectorate','yepCountry', 'nccWing', 'jdJwSdSw','nccCertificate','tShirtSize','foodPreference', 'covidVaccinationStatus'];
        
            fieldIds.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.setAttribute('readonly', true);
                    field.setAttribute('disabled', true);
                }
            });
        }



function toggleEditMode(editMode) {
     if (editMode) {
        enableFields();
    } else {
        disableFields();
        displayDetails(data); // Revert to original data
    }
    const readOnlyFields = document.querySelectorAll('.tabcontent input');
    readOnlyFields.forEach(field => {
        field.readOnly = !editMode; // Make fields editable or read-only
    });

    document.getElementById('editButton').style.display = editMode ? 'none' : 'inline';
    document.getElementById('saveButton').style.display = editMode ? 'inline' : 'none';
    document.getElementById('cancelButton').style.display = editMode ? 'inline' : 'none';
}
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


function updateDetails(Id) {
   // Show loader
    document.getElementById('loader').style.display = 'flex';
    const url = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/${Id}`;
        // Gathering selected JD/JW/SD/SW values for update
const selectedJdJwSdSw = Array.from(document.querySelectorAll('input[name="jdJwSdSw"]:checked'))
    .map(checkbox => checkbox.value)
    .join(';');

// Gathering selected NCC Certificate values for update
const selectedNccCertificate = Array.from(document.querySelectorAll('input[name="nccCertificate"]:checked'))
    .map(checkbox => checkbox.value)
    .join(';');
    const updatedData = {
        // Gather updated fields from the form
         // Basic Details

    CADET_Official_Email__c: document.getElementById('cadetOfficialEmail').value,
    Salutation: document.getElementById('salutation').value,
    FirstName: document.getElementById('firstName').value,
    LastName: document.getElementById('lastName').value,
    Birthdate: document.getElementById('birthdate').value,
    Gender__c: document.getElementById('gender').value,
    Emergency_Contact_Name__c: document.getElementById('emergencyContactName').value,
    Emergency_Contact_Relationship__c: document.getElementById('emergencyContactRelationship').value,
    Emergency_Contact_Phone__c: document.getElementById('emergencyContactPhone').value,

        // Contact Details
    MailingStreet: document.getElementById('mailingStreet').value,
    MailingCity: document.getElementById('mailingCity').value,
    MailingState: document.getElementById('mailingState').value,
    MailingPostalCode: document.getElementById('mailingPostalCode').value,
    MailingCountry: document.getElementById('mailingCountry').value,
    MobilePhone: document.getElementById('mobilePhone').value,
    OtherPhone: document.getElementById('otherPhone').value,
    Email: document.getElementById('email').value,
    Current_City__c: document.getElementById('currentCity').value,
    State__c: document.getElementById('state').value,
    Pin_Code__c: document.getElementById('pinCode').value,

        // Professional Details
    Educational_Qualification__c: document.getElementById('educationalQualification').value,
    College_Other_Institution__c: document.getElementById('collegeOtherInstitution').value,
    Year_of_Degree_Completion__c: document.getElementById('yearOfDegreeCompletion').value,
    Profession__c: document.getElementById('profession').value,
    Employer_Name__c: document.getElementById('employerName').value,
    Job_Title__c: document.getElementById('jobTitle').value,

            // NCC Details
            JD_JW_SD_SW__c: selectedJdJwSdSw,
    NCC_Certificate__c: selectedNccCertificate,
    NCC_Directorate__c: document.getElementById('nccDirectorate').value,
    NCC_Directorate_Unit_Etc__c: document.getElementById('nccDirectorateUnitEtc').value,
    RD_Other_Camp_Details__c: document.getElementById('rdOtherCampDetails').value,
    YEP_Year__c: document.getElementById('yepYear').value,
    YEP_Country__c: document.getElementById('yepCountry').value,
    NCCAA_Membership_Number__c: document.getElementById('nccaaMembershipNumber').value,
    NCC_Wing__c: document.getElementById('nccWing').value,
    //  JD_JW_SD_SW__c: document.getElementById('jdJwSdSw').value.join(';'),
    NCC_Group__c: document.getElementById('nccGroup').value,
    //  NCC_Certificate__c: document.getElementById('nccCertificate').value.join(';'),
    Year_of_Completion_of_NCC__c: document.getElementById('yearOfCompletionOfNCC').value,
    Years_in_NCC__c: document.getElementById('yearsInNCC').value,
    Important_NCC_Camps__c: document.getElementById('importantNccCamps').value,
    Achievements_in_NCC__c: document.getElementById('achievementsInNcc').value,
    RD_Camp_Year__c: document.getElementById('rdCampYear').value,

    // Social Details
    Instagram_ID__c: document.getElementById('instagramID').value,
    Facebook_ID__c: document.getElementById('facebookID').value,
    Twitter_ID__c: document.getElementById('twitterID').value,
    LinkedIn_URL__c: document.getElementById('linkedInURL').value,
    Short_Bio__c: document.getElementById('shortBio').value,
    Long_Bio__c: document.getElementById('longBio').value,


    // Other Details
    T_Shirt_Size__c: document.getElementById('tShirtSize').value,
    Languages_Known__c: document.getElementById('languagesKnown').value,
    Hobbies_and_Achievements__c: document.getElementById('hobbiesAchievements').value,
    Food_Preference__c: document.getElementById('foodPreference').value,
    COVID_Vaccination_Status__c: document.getElementById('covidVaccinationStatus').value
    };

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer 00DC1000000P5Nt!AQEAQIVrkTQQGhW.prvhAHZ6EsAigBsxFhNN3nb26.jF8BC6J_9SzjSpKsYBkqTwXJlAlYlHJMdxoWL7erSi3HMol1JkDWZP`, // Replace with your actual token
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
    if (response.ok) {
        if (response.status === 204) {
           // Hideloader
    document.getElementById('loader').style.display = 'none';
            // No content to parse, just handle the success case
            alert('Details updated successfully');
        } else {
            // Parse the response JSON if the status is not 204
           return response.json().then(data => {
              // Show loader
    document.getElementById('loader').style.display = 'none';
                alert('Details updated successfully');
                displayDetails(data);
            });
        }
    } else {
        // Handle non-200 status codes
        return response.text().then(text => {
            throw new Error(`Error ${response.status}: ${text}`);
        });
    }
})
.catch(error => console.error('Error updating details:', error));
    disableFields();
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
