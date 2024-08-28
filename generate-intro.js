// Mock data
let people = [];
let selectedPeople = [];

async function fetchPeople() {
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
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const listElement = document.getElementById('list');
    const items = listElement.querySelectorAll('li');
    const topMargin = 60;  // Top margin in px
    const bottomMargin = 30; // Bottom margin in px   
    const startY = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerImageUrl = 'generate-intro.png'; // Path to your PNG letterhead image
    let y = startY;

    // Add letterhead image
    async function addHeaderImage(url) {
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
                        doc.addImage(imgObj, 'PNG', 0, 0, pageWidth, pageHeight);
                        URL.revokeObjectURL(imgData); // Clean up the object URL
                        resolve();
                    } catch (addImageError) {
                        reject(new Error(`Error adding letterhead image to PDF: ${addImageError.message}`));
                    }
                };
                imgObj.onerror = () => {
                    reject(new Error('Error loading letterhead image.'));
                };
                imgObj.src = imgData;
            });
        } catch (error) {
            console.error('Error loading letterhead image:', error.message);
        }
    }

    async function addContent() {
        for (const item of items) {
            const photoUrl = item.getAttribute('data-photo-url') || 'images/placeholder.jpg';
            const name = item.getAttribute('data-name');
            const trainerId = item.getAttribute('data-trainer-id');
            const shortBio = item.getAttribute('data-short-bio');

            if (y + 40 > pageHeight - bottomMargin) {
                doc.addPage();
                await addHeaderImage(headerImageUrl); // Add letterhead on new page
                y = topMargin;
            }

            if (photoUrl) {
                try {
                    await addImageFromUrl(photoUrl, 10, y, 30, 30); // Adjust size as needed
                    doc.setFontSize(12);
                    const textX = 50;
                    const textY = y + 15;
                    if (name) {
                        doc.text(`Name: ${name}`, textX, textY);
                    }
                    if (trainerId) {
                        doc.text(`CADET Trainer ID: ${trainerId}`, textX, textY + 10);
                    }
                    if (shortBio) {
                        const bioText = `Short Bio: ${shortBio}`;
                        const bioWidth = pageWidth - 60; // Allow space for margins
                        const bioLines = doc.splitTextToSize(bioText, bioWidth);
                        doc.text(bioLines, textX, textY + 20);
                    }
                    y += 35; // Adjust for spacing between items
                } catch (error) {
                    console.error('Error adding image to PDF:', error);
                }
            }
        }
    }

    await addHeaderImage(headerImageUrl);
    await addContent();
    doc.save('people-document.pdf');
});

// Initialize page
fetchPeople().then(() => {
    renderList();
});
