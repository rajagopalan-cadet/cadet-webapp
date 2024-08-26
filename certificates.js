document.getElementById('generateButton').addEventListener('click', generateDocument);

async function generateDocument() {
    try {
        const trainerId = document.getElementById('trainerId').value;

        const selectedRadio = document.querySelector('input[name="documentType"]:checked');

        if (!selectedRadio) {
            alert('Please select a document type.');
            return;
        }

        const documentType = selectedRadio.value;

        if (!trainerId) {
            alert('Please enter a valid CADET Trainer ID in the format CT-123');
            return;
        }

        // Fetch trainer details using the function from trainer.js
        const data = await fetchTrainerDetails();

        if (documentType === 'certificate') {
            generateCertificate(data);
        } else {
            // Generate letter content (to be implemented as needed)
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating document. Please try again.');
    }
}

function generateCertificate(data) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const placeholders = {
            '{{full name}}': data.FirstName + ' ' + data.LastName,
            '{{id}}': data.CADET_Trainer_ID__c,
            '{{date}}': formatDate(new Date())
        };

        replaceTextOnImage(ctx, placeholders);

        canvas.toBlob(function(blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${data.CADET_Trainer_ID__c}-certificate.png`;
            link.click();
        });
    };

    img.src = 'trainer-certificate-template.png'; // Path to your certificate template image
}

function replaceTextOnImage(ctx, placeholders) {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    const textPositions = {
        '{{full name}}': { x: 300, y: 200 },
        '{{id}}': { x: 300, y: 250 },
        '{{date}}': { x: 300, y: 300 }
    };

    for (const [placeholder, text] of Object.entries(placeholders)) {
        const { x, y } = textPositions[placeholder];
        ctx.fillText(text, x, y);
    }
}

function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
}
