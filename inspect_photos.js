const axios = require('axios');

async function inspectTalkingPhotos() {
    try {
        const response = await axios.get('http://localhost:3000/api/heygen/avatars');
        const talkingPhotos = response.data.data.talking_photos || [];

        console.log(`Total talking photos: ${talkingPhotos.length}`);

        // Check first 5 photos for available properties
        console.log('\nSample talking photo properties:');
        const sample = talkingPhotos.slice(0, 5);
        sample.forEach((photo, index) => {
            console.log(`\n--- Photo ${index + 1} ---`);
            console.log(JSON.stringify(photo, null, 2));
        });

        // Check if there are any unique properties we can filter on
        if (talkingPhotos.length > 0) {
            console.log('\n\nAll available keys in first photo:');
            console.log(Object.keys(talkingPhotos[0]));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectTalkingPhotos();
