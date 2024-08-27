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

    // try {
    //     const token = await getAccessToken();
    //     await fetchDetails(trainerId, token);
    // } catch (error) {
    //     console.error('Error fetching access token:', error);
    // } finally {
    //     // Hide loader
    //     document.getElementById('loader').style.display = 'none';
    // }
});

async function fetchDetails(trainerId, token) {
    const url = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`;
    const token = '00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU'
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

    // Populate form fields with data
    // Example: document.getElementById('basicField').value = data.FieldName;

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
            'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // Replace with your actual token
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
