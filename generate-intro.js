// Mock data
let people = [];
let selectedPeople = [];

async function fetchPeople() {
    const query = "SELECT CADET_Trainer_ID__c,Id, Name, Short_Bio__c, PhotoUrl FROM Contact WHERE Certification_Status__c='Certified' ORDER BY Name";
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
        people = data.records.map(record => ({
            name: record.Name,
            id: record.Id,
            CADET_Trainer_ID: record.CADET_Trainer_ID__c,
            details: record.Short_Bio__c,
            photoUrl: record.PhotoUrl
        }));
   console.log(people);  // You can process the 'people' array as needed
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function updateDropdown(query) {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '';
    if (query) {
        const filteredPeople = people.filter(person => person.name.toLowerCase().includes(query.toLowerCase()));
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
    selectedPeople.forEach(id => {
        const person = people.find(p => p.id === id);
        if (person) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${person.name} - ${person.CADET_Trainer_ID}
                <button onclick="removeFromList('${id}')">Remove</button>
            `;
            li.setAttribute('data-name', person.name);
            li.setAttribute('data-trainer-id', person.CADET_Trainer_ID);
            li.setAttribute('data-short-bio', person.details);
            li.setAttribute('data-photo-url', person.photoUrl);
            listElement.appendChild(li);
        }
    });
}

function removeFromList(id) {
    selectedPeople = selectedPeople.filter(personId => personId !== id);
    renderList();
    updateDropdown(document.getElementById('search-name').value);
}

document.getElementById('search-name').addEventListener('click', () => {
    updateDropdown(document.getElementById('search-name').value);
});

document.getElementById('generate-pdf').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const listElement = document.getElementById('list');
    const items = listElement.querySelectorAll('li');
    const startY = 20;
    const lineHeight = 40; // Adjust line height as needed
    const pageHeight = doc.internal.pageSize.height;
    let y = startY;

    // Helper function to add image from URL
    async function addImageFromUrl(url, x, y, width, height) {
        try {
            const img = await fetch(url).then(res => res.blob());
            const imgData = URL.createObjectURL(img);
            return new Promise((resolve, reject) => {
                const imgObj = new Image();
                imgObj.onload = () => {
                    doc.addImage(imgObj, 'JPEG', x, y, width, height);
                    resolve();
                };
                imgObj.onerror = reject;
                imgObj.src = imgData;
            });
        } catch (error) {
            console.error('Error loading image:', error);
        }
    }

    for (const item of items) {
        const photoUrl = item.getAttribute('data-photo-url');
        const name = item.getAttribute('data-name');
        const trainerId = item.getAttribute('data-trainer-id');
        const shortBio = item.getAttribute('data-short-bio');

        if (y + lineHeight > pageHeight) {
            doc.addPage();
            y = 20; // Reset y to top after adding a new page
        }

        // Add photo
        if (photoUrl) {
            await addImageFromUrl(photoUrl, 10, y, 30, 30); // Adjust size as needed
            y += 35; // Space between photo and text
        }

        // Add name
        doc.setFontSize(12);
        doc.text(`Name: ${name}`, 50, y);
        y += 10;

        // Add CADET Trainer ID
        doc.text(`CADET Trainer ID: ${trainerId}`, 50, y);
        y += 10;

        // Add short bio
        doc.text(`Short Bio: ${shortBio}`, 50, y);
        y += lineHeight; // Space between records
    }

    doc.save('people-document.pdf');
});

document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('dropdown');
    if (event.target.closest('#dropdown') || event.target.closest('#search-name')) {
        // Click inside the dropdown or the input field
        return;
    }
    dropdown.style.display = 'none'; // Hide dropdown if clicking outside
});

// Initialize page
fetchPeople().then(() => {
    renderList();
});
