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
    // Check if the trainer is certified
    if (data.Certification_Status__c !== 'Certified') {
        showErrorModal('This trainer is not Certified.');
        return;
    }
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
        ctx.font = 'bold 35px Arial';
        ctx.fillStyle = '#093A7B';  // Color for name
        ctx.fillText(fullName, 112, 312);  // Adjust x and y coordinates based on template

        // CADET Trainer ID
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#093A7B';  // Color for ID
        ctx.fillText(cadetId, 315, 368);   // Adjust x and y coordinates based on template

        // Date
        ctx.font = '17px Arial';
        ctx.fillStyle = '#000000';  // Color for date
        ctx.fillText(currentDate, 365, 742);  // Adjust x and y coordinates based on template

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
    const letterTemplate = 'trainer-letter-template.png'; // Path to the letter template

    const img = new Image();
    img.src = letterTemplate;

    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw the template image on the canvas
        ctx.drawImage(img, 0, 0);

        // Set font and style for the letter text
        ctx.font = '35px Arial';
        ctx.fillStyle = '#000'; // Text color

        // Extract full name, gender, and dates
        const fullName = data.Name || 'John Doe';
        const gender = data.Gender__c || 'Other'; // Default to 'Other' if gender is not provided
        const certificationStatus = data.Certification_Status__c;
        const certificationDate = data.Certification_Date__c || 'Date Not Provided';
        const decertificationDate = data.Date_of_Decertification__c || 'Present';

        // Determine pronouns based on gender
        let pronounSubject = 'He';
        let pronounObject = 'him';
        let pronounPossessive = 'his';

        if (gender === 'Female') {
            pronounSubject = 'She';
            pronounObject = 'her';
            pronounPossessive = 'her';
        } else if (gender === 'Other') {
            pronounSubject = 'He/She';
            pronounObject = 'him/her';
            pronounPossessive = 'his/her';
        }

        // Determine the date range based on certification status
        const dateRange = certificationStatus === 'Certified'
            ? `${certificationDate} till date`
            : `${certificationDate} to ${decertificationDate}`;

        // The content of the letter
        const letterText = `This is to recognize that ${fullName} has graciously volunteered with EXPA as a CADET Trainer from ${dateRange}. ${pronounSubject} has contributed tremendously to the EXPA CADET Program and to the professional development of NCC cadets through ${pronounPossessive} dedication and focus. ${pronounSubject}'s skills in coaching young people in areas of Communication, Critical Thinking, Ethics and Gender Sensitivity have been exceptional. ${pronounSubject} would be an asset to any organization. We wish ${pronounObject} a brilliant and successful career ahead.`;

          // Adjust the width for the text to fit within margins
        const margin = 200;
        const maxWidth = canvas.width - 2 * margin;
        
        // Split text into lines and write it on the canvas (adjust positions as per the template)
        const lines = splitTextToLines(ctx, letterText, maxWidth); // Adjust width as necessary
        let y = 475; // Starting y position for the text

        lines.forEach(line => {
            ctx.fillText(line, margin, y); // Adjust x and y coordinates based on the template
            y += 40; // Move to the next line (adjust line height if necessary)
        });

        // Add the date of generation at the bottom
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const dateX = 150; // X position for the date
        const dateY = 1575; // Y position for the date

        ctx.font = '30px Arial'; // Font size for the date
        ctx.fillText(`${currentDate}`, dateX, dateY); // Add date to canvas

        // Convert canvas to an image file and trigger download
        const link = document.createElement('a');
        link.download = `${fullName}_letter.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
}

// Utility function to split text into lines that fit within the specified width
function splitTextToLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });

    lines.push(currentLine.trim());
    return lines;
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

