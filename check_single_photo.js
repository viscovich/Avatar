const axios = require('axios');
const fs = require('fs');
const path = require('path');

function getApiKey() {
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/HEYGEN_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

async function checkSpecificPhoto() {
    const apiKey = getApiKey();
    if (!apiKey) return;

    const targetId = '57dfb92d5e1d45b389ab34b1fca3ff99';

    try {
        // Try v2/talking_photos/:id
        console.log(`Checking /v2/talking_photos/${targetId}...`);
        // Note: I am guessing the endpoint structure here
        try {
            const response = await axios.get(`https://api.heygen.com/v2/talking_photos/${targetId}`, {
                headers: { 'X-Api-Key': apiKey }
            });
            console.log('Success!');
            console.log(JSON.stringify(response.data, null, 2));
        } catch (e) {
            console.log('Failed v2:', e.response?.status);
        }

        // Try v1/talking_photos/:id
        try {
            console.log(`Checking /v1/talking_photos/${targetId}...`);
            const response = await axios.get(`https://api.heygen.com/v1/talking_photos/${targetId}`, {
                headers: { 'X-Api-Key': apiKey }
            });
            console.log('Success!');
            console.log(JSON.stringify(response.data, null, 2));
        } catch (e) {
            console.log('Failed v1:', e.response?.status);
        }

    } catch (error) {
        console.error(error);
    }
}

checkSpecificPhoto();
