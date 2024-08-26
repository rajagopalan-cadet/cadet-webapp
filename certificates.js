async function generateDocument() {
    try {
        const trainerId = document.getElementById('trainerId').value;
        console.log('Trainer ID:', trainerId);

        const selectedRadio = document.querySelector('input[name="documentType"]:checked');
        console.log('Selected Radio:', selectedRadio);

        if (!selectedRadio) {
            alert('Please select a document type.');
            return;
        }

        const documentType = selectedRadio.value;
        console.log('Document Type:', documentType);

        if (!trainerId) {
            alert('Please enter a valid CADET Trainer ID in the format CT-123');
            return;
        }

        // Fetch trainer details using the function from trainer.js
        const data = await fetchTrainerDetails(trainerId);

        if (documentType === 'certificate') {
            // Generate certificate with text overlay
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

         // Define placeholders and replacements
         const placeholders = {
            '{{full name}}': data.name,
            '{{id}}': data.CADET_Trainer_ID__c,
            '{{date}}': formatDate(new Date())
        };

      // Replace placeholders on the certificate image
      replaceTextOnImage(ctx, placeholders);

      const blob = canvas.toBlob(function(blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${data.CADET_Trainer_ID__c}-certificate.png`;
          link.click();
      });
  };

  img.src = 'trainer-certificate-template.png'; // Path to your certificate template image
}

function replaceTextOnImage(ctx, placeholders) {
    // Set font style and color
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    // Example coordinates for text positioning
    const textPositions = {
        '{{full name}}': { x: 300, y: 200 }, // Adjust as needed
        '{{id}}': { x: 300, y: 250 }, // Adjust as needed
        '{{date}}': { x: 300, y: 300 } // Adjust as needed
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
