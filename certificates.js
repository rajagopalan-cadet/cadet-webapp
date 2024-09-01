let data = {};
let trainerId = null;
let trainerRecordId = null;
let salesforceToken = null;

document.addEventListener('DOMContentLoaded', () => {
    trainerId = sessionStorage.getItem('trainerId');
    trainerRecordId = sessionStorage.getItem('trainerRecordId');
    salesforceToken = sessionStorage.getItem('salesforceToken');

    if (trainerId || trainerRecordId) {
        console.log('Trainer ID:', trainerId);
        console.log('Trainer Record ID:', trainerRecordId);
        console.log('Trainer Details fetched from session');
        
        // You can add further logic here to use the retrieved values
    } else {
        console.log('No trainer information found in sessionStorage.');
    }

    const letterRadio = document.getElementById('letter');
    const certificateRadio = document.getElementById('certificate');
    const generateButton = document.getElementById('generateButton');

    function validateForm() {
        const trainerIdFilled = trainerId && trainerId.trim() !== '';
        const documentTypeSelected = letterRadio.checked || certificateRadio.checked;

        if (!trainerIdFilled) {
            showErrorModal('Trainer ID is required.');
        } else if (!documentTypeSelected) {
            showErrorModal('Please select a document type.');
        } else {
            hideErrorModal(); // Hide error modal if validation is successful
        }

        generateButton.disabled = !(trainerIdFilled && documentTypeSelected);
    }

    // Validate form on input change and radio button change
    letterRadio.addEventListener('change', validateForm);
    certificateRadio.addEventListener('change', validateForm);

    // Initial validation
    validateForm();
});

document.getElementById('generateButton').addEventListener('click', async function() {
    try {
        showLoader(); // Show loader when the button is clicked
        
        await fetchDetails(trainerId, salesforceToken);
        showSuccessModal('Details have been successfully fetched.');
    } catch (error) {
        console.error('Error fetching details:', error);
        
        // Show error message if there was an issue fetching details
        showErrorModal('Failed to fetch details. Please try again.');
    } finally {
        hideLoader(); // Hide loader after fetching details is complete
    }
});

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
            const data = await response.json(); // Assign fetched data to global variable
            generateCertificate(data);
            showSuccessModal('Details have been successfully fetched and processed.');
        } else {
            console.error('Error fetching details:', response.statusText);
            showErrorModal('Failed to fetch details. Please check the trainer ID and try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorModal('An unexpected error occurred while fetching details. Please try again.');
    } finally {
        hideLoader(); // Hide loader after fetching details is complete
    }
}

function generateCertificate(data) {
    // Check which document type is selected
    const documentType = document.querySelector('input[name="documentType"]:checked').value;

    if (documentType === 'certificate') {
        generateAndDownloadCertificate(data);
    } else if (documentType === 'letter') {
        generateAndDownloadLetter(data);
    }
}

function generateAndDownloadCertificate(data) {
    // Path to the certificate template image (update with your actual path)
    const certificateTemplate = 'templates/trainer-certificate-template.png';

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
        // showErrorModal('Failed to load the certificate template. Please try again later.');
    };
}

async function generateAndDownloadLetter(data) {
    const templateUrl = 'templates/trainer-letter-template.pdf'; // Path to the template PDF

    // Fetch the template PDF
    const response = await fetch(templateUrl);
    const templateBytes = await response.arrayBuffer();

    // Load the template PDF
    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);

    // Get the first page of the PDF
    const pdfPage = pdfDoc.getPages()[0];
    const { width, height } = pdfPage.getSize();
    
    // Function to format dates as dd-mmm-yyyy
    function formatDate(dateString) {
        if (!dateString) return 'Date Not Provided'; // Handle case where no date is provided

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        
        return date.toLocaleDateString('en-GB', options); // 'en-GB' provides 'dd-mmm-yyyy' format
    }
    
    // Extract full name, gender, and dates
    const fullName = data.Name || 'John Doe';
    const gender = data.Gender__c || 'Other'; // Default to 'Other' if gender is not provided
    const certificationStatus = data.Certification_Status__c;
    const certificationDate = formatDate(data.Certification_Date__c) || 'Date Not Provided';
    const decertificationDate = formatDate(data.Date_of_Decertification__c) || 'Present';

    // Determine pronouns based on gender
    let pronounSubject = 'He';
    let pronounObject = 'him';
    let pronounPossessive = 'his';

    if (gender === 'Female') {
        pronounSubject = 'She';
        pronounObject = 'her';
        pronounPossessive = 'her';
    } else if (gender === 'Other') {
        pronounSubject = 'They';
        pronounObject = 'them';
        pronounPossessive = 'their';
    }

    // Determine the date range based on certification status
    const dateRange = certificationStatus === 'Certified'
        ? `${certificationDate} till date`
        : `${certificationDate} to ${decertificationDate}`;

    // The content of the letter
    const letterText = `This is to recognize that ${fullName} has graciously volunteered with EXPA as a CADET Trainer from ${dateRange}. ${pronounSubject} has contributed tremendously to the EXPA CADET Program and the professional development of NCC cadets through ${pronounPossessive} dedication and focus. ${pronounPossessive} skills in coaching young people in areas of Communication, Critical Thinking, Ethics, and Gender Sensitivity have been exceptional. ${pronounSubject} would be an asset to any organization. We wish ${pronounObject} a brilliant and successful career ahead.`;

    // Define text settings
    const fontSize = 14;
    const margin = 60;
    const textWidth = width - 2 * margin;
    const lineSpacing = fontSize * .75; // Line spacing set to 1.5 times the font size
    
    // Use built-in Helvetica font
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    // Function to split text into lines that fit within the specified width
    function splitTextToLines(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = font.widthOfTextAtSize(testLine, fontSize);
            if (metrics > maxWidth && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });

        lines.push(currentLine.trim());
        return lines;
    }

    // Function to draw justified text on the PDF
    function drawJustifiedText(text, x, y, maxWidth) {
        const lines = splitTextToLines(text, maxWidth);

        lines.forEach((line, index) => {
            const words = line.split(' ');
            const totalWidth = font.widthOfTextAtSize(line, fontSize);
            const spaceWidth = font.widthOfTextAtSize(' ', fontSize);
           
           // Calculate extra space between words for justification
            const extraSpacing = words.length > 1 ? (maxWidth - totalWidth) / (words.length - 1) : 0;

            let lineX = x;
             words.forEach((word, wordIndex) => {
            pdfPage.drawText(word, { x: lineX, y: y, size: fontSize, font: font });
            lineX += font.widthOfTextAtSize(word, fontSize) + spaceWidth;

            // Add extra spacing between words, but not after the last word
            if (wordIndex < words.length - 1) {
                lineX += extraSpacing;
            }
        });

        y -= (fontSize + lineSpacing); // Move to the next line
    });
}

    // Adjust the width for the text to fit within margins
    const yPosition = height - 200; // Starting vertical position

    // Draw the text on the page
    drawJustifiedText(letterText, margin, yPosition, textWidth);

    // Add the date of generation at the bottom
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    pdfPage.drawText(`${currentDate}`, { x: 82, y: 180, size: fontSize-1, font: font });

    // Serialize the PDF and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fullName}_letter.pdf`;
    link.click();
}
