let data = {};
const token = '00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU'; // Hard-coded token

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
            data = await response.json(); // Assign fetched data to global variable
            getRecords(data);
        } else {
            console.error('Error fetching details:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
async function getRecords(data) {
    const instanceUrl = 'https://cadetprogram--charcoal.sandbox.my.salesforce.com'; // Replace with your actual instance URL
    const id = encodeURIComponent(data.Id);

    // Calculate the start date of the current fiscal year
    const today = new Date();
    const currentYear = today.getFullYear();
    const fiscalYearStartDate = today.getMonth() >= 3 ? `${currentYear}-04-01` : `${currentYear - 1}-04-01`; // Fiscal year starts on April 1st

    // URLs for API requests
    const allTimeUrl= '${instanceurl}/services/data/v52.0/query?q=SELECT+Name,+Event_Name__c,+Camp_Start_Date_F__c,+Attendee_Type__c+FROM+CADET_Event_Attendees__c+WHERE+Attendee_Trainer__c+=+'${Id}'+ORDER+BY+Camp_Start_Date_F__c+DESC';
    const currentFyUrl = '${instanceurl}/services/data/v52.0/query?q=SELECT+Name,+Event_Name__c,+Camp_Start_Date_F__c,+Attendee_Type__c+FROM+CADET_Event_Attendees__c+WHERE+Camp_Start_Date_F__c+>=+${fiscalYearStartDate}+AND+Attendee_Trainer__c+=+'${Id}'+ORDER+BY+Camp_Start_Date_F__c+DESC';

    try {
        // Fetch data from both APIs
        const [allTimeResponse, currentFyResponse] = await Promise.all([
            fetch(allTimeUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Replace with your access token
                    'Content-Type': 'application/json'
                }
            }),
            fetch(currentFyUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Replace with your access token
                    'Content-Type': 'application/json'
                }
            })
        ]);

        // Check if both requests were successful
        if (!allTimeResponse.ok || !currentFyResponse.ok) {
            throw new Error('One or both API requests failed');
        }

        // Parse JSON responses
        const allTimeData = await allTimeResponse.json();
        const currentFyData = await currentFyResponse.json();

        // Process and return the results as needed
        return {
            allTime: allTimeData,
            currentFy: currentFyData
        };
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
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
