import axios from 'axios';
const test = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:5001/');
        console.log('SUCCESS:', res.data);
    } catch (e) {
        console.error('FAILED:', e.message);
        if (e.response) console.error('Response:', e.response.status);
    }
};
test();
