const axios = require('axios');

async function checkAvatars() {
    try {
        const response = await axios.get('http://localhost:3000/api/heygen/avatars');
        const targetId = '1c59224bb8fa4fd9a57274b6f3d189ea';

        console.log(`Searching for ID: ${targetId}`);

        const avatars = response.data.data.avatars || [];
        const talkingPhotos = response.data.data.talking_photos || [];

        const foundAvatar = avatars.find(a => a.avatar_id === targetId);
        const foundPhoto = talkingPhotos.find(p => p.talking_photo_id === targetId);

        if (foundAvatar) {
            console.log('Found in avatars:', JSON.stringify(foundAvatar, null, 2));
        } else {
            console.log('Not found in avatars list');
        }

        if (foundPhoto) {
            console.log('Found in talking_photos:', JSON.stringify(foundPhoto, null, 2));
        } else {
            console.log('Not found in talking_photos list');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkAvatars();
