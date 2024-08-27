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
    const allTimeUrl = `${instanceUrl}/services/data/v52.0/query?q=SELECT+Name,+Event_Name__c,+Camp_Start_Date_F__c,+Attendee_Type__c+FROM+CADET_Event_Attendees__c+WHERE+Attendee_Trainer__c='${id}'+ORDER+BY+Camp_Start_Date_F__c+DESC`;
    const currentFyUrl = `${instanceUrl}/services/data/v52.0/query?q=SELECT+Name,+Event_Name__c,+Camp_Start_Date_F__c,+Attendee_Type__c+FROM+CADET_Event_Attendees__c+WHERE+Camp_Start_Date_F__c>=${fiscalYearStartDate}+AND+Attendee_Trainer__c='${id}'+ORDER+BY+Camp_Start_Date_F__c+DESC`;

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
function processAPIResponse(allTimeData, currentFyData) {
    // Populate the tab counts
    populateTabCounts(allTimeData.totalSize, currentFyData.totalSize);

    // Populate summary views and details tables
    populateSummaryView(allTimeData, 'allTime');
    populateSummaryView(currentFyData, 'currentYear');

    populateDetailsTable(allTimeData, 'allTime');
    populateDetailsTable(currentFyData, 'currentYear');
}
function populateTabCounts(allTimeTotalSize, currentFyTotalSize) {
    // Update the tab headers with total counts
    document.getElementById('allTimeTabCount').textContent = allTimeTotalSize || 0;
    document.getElementById('currentYearTabCount').textContent = currentFyTotalSize || 0;
}

function populateSummaryView(data, type) {
    let totalCamps = 0;
    let totalTeamLead = 0;
    let totalTrainer = 0;
    let totalObserver = 0;

    data.records.forEach(record => {
        totalCamps++;
        if (record.Attendee_Type__c === 'Team Lead') {
            totalTeamLead++;
        } else if (record.Attendee_Type__c === 'Trainer') {
            totalTrainer++;
        } else if (record.Attendee_Type__c === 'Observer') {
            totalObserver++;
        }
    });

    document.getElementById(`${type}TotalCamps`).textContent = `Total Camps: ${totalCamps}`;
    document.getElementById(`${type}TotalTeamLead`).textContent = `Total Camps as Team Lead: ${totalTeamLead}`;
    document.getElementById(`${type}TotalTrainer`).textContent = `Total Camps as Trainer: ${totalTrainer}`;
    document.getElementById(`${type}TotalObserver`).textContent = `Total Camps as Observer: ${totalObserver}`;
}

function populateDetailsTable(data, type) {
    const tableBody = document.getElementById(`${type}DetailsTable`).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the table

    data.records.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1; // Sl No
        row.insertCell(1).textContent = record.Id || ''; // SF Event ID
        row.insertCell(2).textContent = record.Event_Name__c || ''; // Event Name
        row.insertCell(3).textContent = record.Camp_Start_Date_F__c || ''; // Start Date
    });
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
