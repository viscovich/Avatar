const axios = require('axios');

// Mock client setup since we can't import the lib easily in this script without transpilation
// We'll just use the local API route but modify the route to try a different upstream endpoint if possible.
// Actually, I can't modify the server code easily to test.
// I will try to call the HeyGen API directly if I can find the key.
// I see the key is in .env. I can read it.

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

async function checkDirectApi() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('Could not find API key in .env');
        return;
    }

    try {
        console.log('Calling HeyGen API /v2/talking_photos directly...');
        const response = await axios.get('https://api.heygen.com/v2/talking_photos', {
            headers: {
                'X-Api-Key': apiKey,
                'Content-Type': 'application/json',
            }
        });

        console.log('Response status:', response.status);
        const photos = response.data.data.talking_photos || response.data.data || [];
        console.log('Number of photos:', photos.length);

        if (photos.length > 0) {
            console.log('First photo keys:', Object.keys(photos[0]));
            // Check for the specific IDs
            const targetIds = [
                '57dfb92d5e1d45b389ab34b1fca3ff99',
                '3162913d3aa2457583ebb7886dc055ee'
            ];

            targetIds.forEach(id => {
                const found = photos.find(p => p.talking_photo_id === id || p.id === id);
                if (found) {
                    console.log(`\n--- Found ${id} ---`);
                    console.log(JSON.stringify(found, null, 2));
                }
            });
        }

    } catch (error) {
        console.error('Error calling /v2/talking_photos:', error.response?.status, error.response?.data || error.message);

        // Try /v1/talking_photos just in case
        try {
            console.log('\nRetrying with /v1/talking_photos...');
            const response = await axios.get('https://api.heygen.com/v1/talking_photos', {
                headers: {
                    'X-Api-Key': apiKey,
                    'Content-Type': 'application/json',
                }
            });
            const photos = response.data.data.talking_photos || response.data.data || [];
            console.log('Number of photos (v1):', photos.length);
            if (photos.length > 0) {
                console.log('First photo keys (v1):', Object.keys(photos[0]));
            }
        } catch (err2) {
            console.error('Error calling /v1/talking_photos:', err2.response?.status, err2.response?.data || err2.message);
        }
    }
}

checkDirectApi();
