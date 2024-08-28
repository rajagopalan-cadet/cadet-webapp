// Mock data
let people = [];
let selectedPeople = [];
let teamLead = null; // Track the Team Lead

async function fetchPeople() {
    document.getElementById('loader').style.display = 'flex'; // Show loader
    const query = "SELECT CADET_Trainer_ID__c,Id, Name, Short_Bio__c, Photo_Link__c FROM Contact WHERE Certification_Status__c='Certified' ORDER BY Name";
    const endpoint = `https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/query?q=${encodeURIComponent(query)}`;
    const accessToken = '00DC1000000P5Nt!AQEAQBSeEygBNh3t0GSsC64aMB7I21Ndb8fuK69NE8tUbyqN6T7DuvL3npLtNk7ax.n0l_CYNJx1wjybfKhIWrwjVCjo5TMb';  // Replace with your actual access token

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        // Assign fetched data to the global people array
        people = data.records.map(record => {
            return {
                name: record.Name,
                id: record.Id,
                CADET_Trainer_ID: record.CADET_Trainer_ID__c,
                details: record.Short_Bio__c,
                photoUrl: record.Photo_Link__c // Directly use Cloudinary URL
            };
        });
        console.log(people);  // You can process the 'people' array as needed
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        document.getElementById('loader').style.display = 'none'; // Hide loader
    }
}


function updateDropdown(query) {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '';
    if (query) {
        const filteredPeople = people.filter(person => 
            person.name.toLowerCase().includes(query.toLowerCase()) || 
            person.CADET_Trainer_ID.toLowerCase().includes(query.toLowerCase())
        );
        filteredPeople.forEach(person => {
            const div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.innerHTML = `
                <input type="checkbox" id="${person.id}" data-name="${person.name}" ${selectedPeople.includes(person.id) ? 'checked' : ''}>
                <label for="${person.id}">${person.name}</label>
            `;
            div.addEventListener('click', () => {
                handleCheckboxChange(person.id);
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function handleCheckboxChange(id) {
    const checkbox = document.getElementById(id);
    if (checkbox.checked) {
        if (!selectedPeople.includes(id)) {
            selectedPeople.push(id);
        }
    } else {
        selectedPeople = selectedPeople.filter(personId => personId !== id);
    }
    renderList();
}

function renderList() {
    const listElement = document.getElementById('list');
    listElement.innerHTML = '';

    // Create table and header row
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Sl No.</th>
                <th>CADET Trainer ID</th>
                <th>Name</th>
                <th>Team Lead</th>
                <th>Action</th>
                <th>Remove</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    
   selectedPeople.forEach((id, index) => {
        const person = people.find(p => p.id === id);
        if (person) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${person.CADET_Trainer_ID}</td>
                <td>${person.name}</td>
                <td>${teamLead === id ? '<span class="team-lead-tag">Team Lead</span>' : ''}</td>
                <td>
                    <button onclick="setTeamLead('${id}')">
                        ${teamLead === id ? 'Remove as Team Lead' : 'Set as Team Lead'}
                    </button>
                </td>
                <td>
                    <button onclick="removeFromList('${id}')">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });

    listElement.appendChild(table);
}

function setTeamLead(id) {
    if (teamLead === id) {
        // Remove the current team lead if the same person is clicked again
        teamLead = null;
    } else if (teamLead) {
        alert('You can only have one team lead. Remove the current team lead first.');
        return;
    } else {
        teamLead = id; // Set new team lead
    }
    renderList(); // Re-render the list
    updateDropdown(document.getElementById('search-name').value);
}

function removeFromList(id) {
    selectedPeople = selectedPeople.filter(personId => personId !== id);
    if (teamLead === id) {
        teamLead = null; // Remove Team Lead if they are being removed from the list
    }
    renderList();
    updateDropdown(document.getElementById('search-name').value);
}

document.getElementById('search-name').addEventListener('input', () => {
    updateDropdown(document.getElementById('search-name').value);
});

// Close dropdown when clicking outside the input box or dropdown list
document.addEventListener('click', (event) => {
    const inputBox = document.getElementById('search-name');
    const dropdown = document.getElementById('dropdown'); // Assuming your dropdown has this ID

    // Check if the click happened outside the input box and dropdown
    if (!inputBox.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none'; // Hide the dropdown
    }
});

document.getElementById('generate-pdf').addEventListener('click', async () => {
    document.getElementById('loader').style.display = 'flex'; // Show loader
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const listElement = document.getElementById('list');
    const items = listElement.querySelectorAll('tr'); // Assuming trainers are now in a table, so select 'tr'
    const topMargin = 20;  // Top margin in mm
    const bottomMargin = 10; // Bottom margin in mm   
    const startY = 60;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const fullPageImageUrl = 'templates/trainer-intro.png'; // URL for letterhead
    let y = startY;

    // Add letterhead image
    async function addFullPageImage(url) {
        try {
            const img = await fetch(url).then(res => {
                if (!res.ok) {
                    throw new Error(`Image fetch failed: ${res.statusText}`);
                }
                return res.blob();
            });
            const imgData = URL.createObjectURL(img);

            return new Promise((resolve, reject) => {
                const imgObj = new Image();
                imgObj.onload = () => {
                    try {
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const pageHeight = doc.internal.pageSize.getHeight();
                        doc.addImage(imgObj, 'PNG', 0, 0, pageWidth, pageHeight);
                        URL.revokeObjectURL(imgData); // Clean up the object URL
                        resolve();
                    } catch (addImageError) {
                        reject(new Error(`Error adding full-page image to PDF: ${addImageError.message}`));
                    }
                };
                imgObj.onerror = () => {
                    reject(new Error('Error loading image.'));
                };
                imgObj.src = imgData;
            });
        } catch (error) {
            console.error('Error loading image:', error.message);
        }
    }

    async function addImageFromUrl(url, x, y, width, height) {
        if (!url || url.trim() === '') {
            console.warn('No URL provided for image.');
            return;
        }

        try {
            const img = await fetch(url).then(res => {
                if (!res.ok) {
                    throw new Error(`Image fetch failed: ${res.statusText}`);
                }
                return res.blob();
            });
            const imgData = URL.createObjectURL(img);

            return new Promise((resolve, reject) => {
                const imgObj = new Image();
                imgObj.onload = () => {
                    try {
                        doc.addImage(imgObj, 'JPEG', x, y, width, height);
                        URL.revokeObjectURL(imgData); // Clean up the object URL
                        resolve();
                    } catch (addImageError) {
                        reject(new Error(`Error adding image to PDF: ${addImageError.message}`));
                    }
                };
                imgObj.onerror = () => {
                    reject(new Error('Error loading image.'));
                };
                imgObj.src = imgData;
            });
        } catch (error) {
            console.error('Error loading image:', error.message);
        }
    }

    async function addContent() {
        const cellPadding = 10; // Padding between image and text
        const imageWidth = 30; // Width of the image
        const textWidth = pageWidth - imageWidth - 2 * cellPadding; // Width of the text area
        
        // Add Team Lead to the top of the PDF
        if (teamLead) {
            const leadPerson = people.find(p => p.id === teamLead);
            if (leadPerson) {
                const photoUrl = leadPerson.photoUrl;
                const name = leadPerson.name;
                const trainerId = leadPerson.CADET_Trainer_ID;
                const shortBio = leadPerson.details;
                
                // Add Team Lead section
                doc.setFontSize(16);
                doc.setFont(undefined, 'bold');
                doc.text('Team Lead', 10, y);
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                if (photoUrl && photoUrl !== 'images/placeholder.jpg') {
                    try {
                        await addImageFromUrl(photoUrl, 10, y + 10, imageWidth, imageWidth);
                    } catch (error) {
                        console.error('Error adding image to PDF:', error);
                    }
                }
                const textX = 10 + imageWidth + cellPadding;
                const textY = y + 15;
                doc.text(`Name: ${name}`, textX, textY);
                doc.text(`CADET Trainer ID: ${trainerId}`, textX, textY + 10);
                if (shortBio) {
                    const bioText = `Short Bio: ${shortBio}`;
                    const bioWidth = textWidth;
                    const bioLines = doc.splitTextToSize(bioText, bioWidth);
                    doc.text(bioLines, textX, textY + 20);
                }
                y = textY + Math.max(imageWidth, doc.getTextDimensions(shortBio).h) + cellPadding;
            }
        }

        // Add the remaining items in the list, excluding the team lead
        for (const item of items) {
            const personId = item.getAttribute('data-trainer-id');
            if (personId !== teamLead) {  // Skip team lead since we've already added them
                const photoUrl = item.getAttribute('data-photo-url');
                const name = item.getAttribute('data-name');
                const trainerId = item.getAttribute('data-trainer-id');
                const shortBio = item.getAttribute('data-short-bio');

                // Check if we need to add a new page
                if (y + 50 > pageHeight - bottomMargin) {
                    doc.addPage();
                    y = startY;
                    await addFullPageImage(fullPageImageUrl); // Add full-page image on new page
                }

                // Add table row with image and text details
                doc.setFontSize(12);

                if (photoUrl && photoUrl !== 'images/placeholder.jpg') {
                    try {
                        await addImageFromUrl(photoUrl, 10, y, imageWidth, imageWidth);
                    } catch (error) {
                        console.error('Error adding image to PDF:', error);
                    }
                }

                const textX = 10 + imageWidth + cellPadding;
                const textY = y + 5;

                if (name) {
                    doc.text(`Name: ${name}`, textX, textY);
                }
                if (trainerId) {
                    doc.text(`CADET Trainer ID: ${trainerId}`, textX, textY + 10);
                }
                if (shortBio) {
                    const bioText = `Short Bio: ${shortBio}`;
                    const bioWidth = textWidth;
                    const bioLines = doc.splitTextToSize(bioText, bioWidth);
                    doc.text(bioLines, textX, textY + 20);
                }

                y += Math.max(imageWidth, doc.getTextDimensions(shortBio).h) + cellPadding;
            }
        }
    }

    try {
        await addFullPageImage(fullPageImageUrl);
        await addContent();
        doc.save('people-document.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        document.getElementById('loader').style.display = 'none'; // Hide loader
    }
});


// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchPeople().then(() => {
        renderList();
    });
});
