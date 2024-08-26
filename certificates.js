document.getElementById('generateButton').addEventListener('click', async () => {
    const trainerId = document.getElementById('trainerId').value;
    const documentType = document.querySelector('input[name="documentType"]:checked').value;

    if (!trainerId) {
        alert('Please enter the CADET Trainer ID.');
        return;
    }

    try {
        const accessToken = '00DC1000000P5Nt!AQEAQFg3rUQiPVTVJMJD1Z3Q2OuiokN_djBDfJpF20rG2bmXmrWXWxCol_66PdmUeaBRgXlXUM8LlSkTg_O6OLr1c301sQL3'; // Replace with your actual Salesforce access token
        const instanceUrl = 'https://cadetprogram--charcoal.sandbox.my.salesforce.com'; // Replace with your Salesforce instance URL
        const url = `${instanceUrl}/services/data/v52.0/sobjects/Contact/CADET_Trainer_ID__c/${trainerId}`;
        const data = await response.json();

        const { name, CADET_Trainer_ID__c, CTOP__c } = data;

        // Generate the document
        generateDocument(name, CADET_Trainer_ID__c, CTOP__c, documentType);
    } catch (error) {
        console.error('Error fetching trainer details:', error);
    }
});

async function generateDocument(name, id, ctop, type) {
    const templateUrl = 'trainer-certificate-template.png';
    const response = await fetch(templateUrl);
    const blob = await response.blob();

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Define text replacement positions
        const replaceText = (text, x, y) => {
            ctx.font = '24px Arial';  // Adjust font size as needed
            ctx.fillStyle = 'black';
            ctx.fillText(text, x, y);
        };

        // Coordinates for text replacement
        const coordinates = {
            fullName: { x: 100, y: 200 },  // Adjust these coordinates as needed
            id: { x: 100, y: 250 }
        };

        replaceText(name, coordinates.fullName.x, coordinates.fullName.y);
        replaceText(id, coordinates.id.x, coordinates.id.y);

        // Create downloadable link
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${type.toLowerCase()}_${id}.png`;
        link.click();
    };
}
