
const axios = require('axios');

async function verifyNotificationFix() {
    const baseUrl = 'http://localhost:5000/api';

    console.log('--- Verifying Notification Fix ---');

    try {
        // 1. Try to call markAsRead with 'undefined' ID
        console.log('Testing PUT /notifications/undefined/read...');
        try {
            await axios.put(`${baseUrl}/notifications/undefined/read`);
        } catch (error) {
            if (error.response) {
                console.log(`Received expected error: ${error.response.status} ${error.response.data.error}`);
                if (error.response.status === 400 && error.response.data.error === 'INVALID_ID') {
                    console.log('✅ Backend validation for "undefined" ID is working.');
                } else {
                    console.log('❌ Unexpected error response from backend.');
                }
            } else {
                console.error('❌ Failed to connect to backend.');
            }
        }

        // 2. Try to call with an empty ID (should be 404 or 400 based on routing)
        console.log('\nTesting PUT /notifications//read (empty ID)...');
        try {
            await axios.put(`${baseUrl}/notifications//read`);
        } catch (error) {
            if (error.response) {
                console.log(`Received error: ${error.response.status}`);
            }
        }

    } catch (err) {
        console.error('Test script error:', err);
    }
}

verifyNotificationFix();
