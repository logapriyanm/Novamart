import axios from 'axios';

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Response:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error Data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testLogin();
