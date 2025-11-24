const axios = require('axios');

async function checkSpecificAvatars() {
    try {
        const response = await axios.get('http://localhost:3000/api/heygen/avatars');
        const talkingPhotos = response.data.data.talking_photos || [];
        const avatars = response.data.data.avatars || [];

        const targetIds = [
            '57dfb92d5e1d45b389ab34b1fca3ff99',
            '3162913d3aa2457583ebb7886dc055ee'
        ];

        console.log(`Searching for IDs: ${targetIds.join(', ')}`);

        targetIds.forEach(id => {
            const foundPhoto = talkingPhotos.find(p => p.talking_photo_id === id);
            const foundAvatar = avatars.find(a => a.avatar_id === id);

            if (foundPhoto) {
                console.log(`\n--- Found in Talking Photos: ${id} ---`);
                console.log('Keys:', Object.keys(foundPhoto));
            }

            if (foundAvatar) {
                console.log(`\n--- Found in Avatars: ${id} ---`);
                console.log('Keys:', Object.keys(foundAvatar));
                const shortObj = { ...foundAvatar };
                if (shortObj.preview_image_url) shortObj.preview_image_url = '...';
                if (shortObj.preview_video_url) shortObj.preview_video_url = '...';
                console.log(JSON.stringify(shortObj, null, 2));
            }

            if (!foundPhoto && !foundAvatar) {
                console.log(`\n--- ID ${id} NOT FOUND in either list ---`);
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkSpecificAvatars();
