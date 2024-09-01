let data = {};
let trainerId = null;
let trainerRecordId = null;
let salesforceToken = null;
let currentPage = {
    allTime: 1,
    currentYear: 1
};
const recordsPerPage = 10; // Number of records per page

document.addEventListener('DOMContentLoaded', () => {
    trainerId = sessionStorage.getItem('trainerId');
    trainerRecordId = sessionStorage.getItem('trainerRecordId');
    salesforceToken = sessionStorage.getItem('salesforceToken');

    if (trainerId || trainerRecordId) {
        console.log('Trainer Details fetched from session');
    } else {
        console.log('No trainer information found in sessionStorage.');
    }
});

window.onload = function() {
    // document.getElementById('loader').style.display = 'flex';

    try { 
        fetchDetails(trainerId, salesforceToken);
    } catch (error) {
        console.error('Error fetching details:', error);
    } finally {
        // Hide loader
        // document.getElementById('loader').style.display = 'none';
    }
};

async function fetchDetails(trainerId, salesforceToken) {
    const url = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${salesforceToken}`,
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
    const instanceUrl = 'https://cadetprogram--charcoal.sandbox.my.salesforce.com';
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
                    'Authorization': `Bearer ${salesforceToken}`, 
                    'Content-Type': 'application/json'
                }
            }),
            fetch(currentFyUrl, {
                headers: {
                    'Authorization': `Bearer ${salesforceToken}`, 
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
        
        // Trigger the processing of API response
        processAPIResponse(allTimeData, currentFyData);
        
    } catch (error) {
        console.error('Error fetching records:', error);
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
        row.insertCell(1).textContent = record.Name || ''; // SF Event ID
        row.insertCell(2).textContent = record.Event_Name__c || ''; // Event Name
        row.insertCell(3).textContent = record.Camp_Start_Date_F__c || ''; // Start Date
    });
}

function openTab(evt, tabName) {
    // Get all elements with class="tabcontent" and hide them
    var tabcontents = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }

    // Get all elements with class="tablink" and remove the "active" class
    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an "active" class to the clicked button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Set the default tab to be 'allTimeTab' on page load
document.addEventListener('DOMContentLoaded', () => {
    var defaultTab = document.querySelector(".tablink[data-tab='allTime']");
    if (defaultTab) {
        openTab({ currentTarget: defaultTab }, 'allTimeTab');
    }
});

function updateTable(data, type) {
    const tableBody = document.getElementById(`${type}DetailsTable`).getElementsByTagName('tbody')[0];
    const start = (currentPage[type] - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const pageRecords = data.records.slice(start, end);

    tableBody.innerHTML = ''; // Clear the table

    pageRecords.forEach((record, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = start + index + 1; // Sl No
        row.insertCell(1).textContent = record.Name || ''; // SF Event ID
        row.insertCell(2).textContent = record.Event_Name__c || ''; // Event Name
        row.insertCell(3).textContent = record.Camp_Start_Date_F__c || ''; // Start Date
    });

    updatePagination(data, type);
}

function updatePagination(data, type) {
    const totalPages = Math.ceil(data.records.length / recordsPerPage);
    document.getElementById(`${type}PageInfo`).textContent = `Page ${currentPage[type]} of ${totalPages}`;

    document.querySelector(`#${type}Pagination .prev`).disabled = (currentPage[type] === 1);
    document.querySelector(`#${type}Pagination .next`).disabled = (currentPage[type] === totalPages);
}

function changePage(type, direction) {
    const newPage = currentPage[type] + direction;
    const totalPages = Math.ceil(data.records.length / recordsPerPage);

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage[type] = newPage;
        updateTable(data, type);
    }
}

