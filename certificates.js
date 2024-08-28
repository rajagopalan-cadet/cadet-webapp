let data = {};
const token = '00DC1000000P5Nt!AQEAQN.rK.Zdu7BHHme8Aqkyu0adVn8alEp1oJdp_kt8OSPX7KWbNIXbY_YR.K.w8b8goOnsPjphctZDnxWHhhOCq6VFBsXU'; // Hard-coded token

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
    // Template image for certificate (you need to replace this with the actual image URL or base64 string)
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

        // Set text style and positions (adjust these positions according to your template)
        ctx.font = '30px Arial';
        ctx.fillStyle = '#000';
        
        // Draw the text on the image (Replace {{full name}}, {{id}}, and {{date}} with actual values)
        const fullName = data.Name || 'John Doe';
        const cadetId = data.CADET_Trainer_ID__c || 'CT-000';
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        ctx.fillText(fullName, 200, 300);  // Position for full name
        ctx.fillText(cadetId, 200, 350);   // Position for CADET Trainer ID
        ctx.fillText(currentDate, 200, 400);  // Position for date

        // Convert canvas to an image file and trigger download
        const link = document.createElement('a');
        link.download = `${fullName}_certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
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
