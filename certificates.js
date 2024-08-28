let data = {};
const token = '00DC1000000P5Nt!AQEAQBSeEygBNh3t0GSsC64aMB7I21Ndb8fuK69NE8tUbyqN6T7DuvL3npLtNk7ax.n0l_CYNJx1wjybfKhIWrwjVCjo5TMb'; // Hard-coded token

document.getElementById('generateButton').addEventListener('click', async function() {
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
    //const token = '00DC1000000P5Nt!AQEAQBSeEygBNh3t0GSsC64aMB7I21Ndb8fuK69NE8tUbyqN6T7DuvL3npLtNk7ax.n0l_CYNJx1wjybfKhIWrwjVCjo5TMb';
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
            generateCertificate(data);
        } else {
            console.error('Error fetching details:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function generateCertificate(data) {
    // Check which document type is selected
    const documentType = document.querySelector('input[name="documentType"]:checked').value;

    if (!documentType) {
        showErrorModal('Please select either "Letter" or "Certificate".');
        return;
    }

    if (documentType === 'certificate') {
        generateAndDownloadCertificate(data);
    } else if (documentType === 'letter') {
        generateAndDownloadLetter(data);
    }
}

function generateAndDownloadCertificate(data) {
    // Path to the certificate template image (update with your actual path)
    const certificateTemplate = 'trainer-certificate-template.png';

    // Load the image
    const img = new Image();
    img.src = certificateTemplate;

    img.onload = function() {
        // Create a canvas to draw the image and text on it
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw the template image on the canvas
        ctx.drawImage(img, 0, 0);

        // Fetch values from the data object
        const fullName = data.Name || 'John Doe';
        const cadetId = data.CADET_Trainer_ID__c || 'CT-000';
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        // Set styles and draw text on the canvas

        // Name
        ctx.font = 'bold 35px Poppins';
        ctx.fillStyle = '#093A7B';  // Color for name
        ctx.fillText(fullName, 105, 270);  // Adjust x and y coordinates based on template

        // CADET Trainer ID
        ctx.font = 'bold 22px Poppins';
        ctx.fillStyle = '#093A7B';  // Color for ID
        ctx.fillText(cadetId, 315, 348);   // Adjust x and y coordinates based on template

        // Date
        ctx.font = 'bold 20px Poppins';
        ctx.fillStyle = '#000000';  // Color for date
        ctx.fillText(currentDate, 350, 700);  // Adjust x and y coordinates based on template

        // Convert canvas to an image file and trigger download
        const link = document.createElement('a');
        link.download = `${fullName}_certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    img.onerror = function() {
        console.error('Error loading the certificate template image.');
        showErrorModal('Failed to load the certificate template. Please try again later.');
    };
}


function generateAndDownloadLetter(data) {
    // Similar implementation as certificate, but using a letter template
    const letterTemplate = 'path/to/trainer-letter-template.png';

    const img = new Image();
    img.src = letterTemplate;

    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        // Draw the text on the image (adjust positions for letter template)
        ctx.font = '30px Arial';
        ctx.fillStyle = '#000';

        const fullName = data.Name || 'John Doe';
        const cadetId = data.CADET_Trainer_ID__c || 'CT-000';
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        ctx.fillText(fullName, 200, 300);  // Adjust position for letter
        ctx.fillText(cadetId, 200, 350);   // Adjust position for letter
        ctx.fillText(currentDate, 200, 400);  // Adjust position for letter

        const link = document.createElement('a');
        link.download = `${fullName}_letter.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
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

