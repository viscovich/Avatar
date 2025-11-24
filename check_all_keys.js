const axios = require('axios');

async function checkAllKeys() {
    try {
        const response = await axios.get('http://localhost:3000/api/heygen/avatars');
        const talkingPhotos = response.data.data.talking_photos || [];

        console.log(`Total photos: ${talkingPhotos.length}`);

        const allKeys = new Set();
        talkingPhotos.forEach(p => {
            Object.keys(p).forEach(k => allKeys.add(k));
        });

        console.log('All unique keys found across all photos:', Array.from(allKeys));

        // Check if any photo has keys other than id, name, preview_image_url
        const standardKeys = ['talking_photo_id', 'talking_photo_name', 'preview_image_url'];

        const specialPhotos = talkingPhotos.filter(p => {
            const keys = Object.keys(p);
            return keys.some(k => !standardKeys.includes(k));
        });

        console.log(`\nPhotos with extra keys: ${specialPhotos.length}`);
        if (specialPhotos.length > 0) {
            console.log(JSON.stringify(specialPhotos[0], null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkAllKeys();
