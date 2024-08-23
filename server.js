const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Enable CORS for all requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Proxy route for Salesforce API requests
app.post('/api/salesforce', async (req, res) => {
    try {
        const response = await axios.post(
            'https://cadetprogram--charcoal.sandbox.my.salesforce.com/services/data/v52.0/sobjects/Contact/',
            req.body,
            { headers: { Authorization: `Bearer 00DC1000000P5Nt!AQEAQJUAT7njCVqFrjx_dwnH93f3jNcsSJjISLGTj53xj_FNknSmIDp2RVffNzruE7c4y3xr_1iUzBANkrvS79yCfVlt7eVZ` } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response.status).send(error.response.data);
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
