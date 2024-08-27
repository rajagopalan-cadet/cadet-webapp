let accessToken = null;

async function getAccessToken() {
    if (accessToken) {
        return accessToken; // Return the cached token if it's available
    }

    const tokenUrl = 'https://test.salesforce.com/services/oauth2/token'; // Use 'https://test.salesforce.com/services/oauth2/token' for sandbox

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', '3MVG9gl7ph1Px3YYH2Ikdrc0k6cuywH0Nme1GPy8YWDEgo13y_XwZxl739Wa2aPSiEufC7QQaFXtYmtlwtBxj'); // Replace with your actual client ID
    params.append('client_secret', 'C15CB19F372907D4424646435FBAE64484FEE68C7B1D9FE07BA9CF5A9BD1C8E3'); // Replace with your actual client secret
    params.append('username', 'rajagopalan@cadetprogram.org.charcoal'); // Replace with your Salesforce username
    params.append('password', 'Raj@salesforce24y3nbFuFT2QtKrfj88zAYPtT6u'); // Replace with your password + security token

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        if (response.ok) {
            const data = await response.json();
            accessToken = data.access_token;
            // You can store the token's expiry time and set up a refresh mechanism if needed
            return accessToken;
        } else {
            console.error('Failed to retrieve access token');
            throw new Error('Token retrieval failed');
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}
