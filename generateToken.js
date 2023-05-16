const axios = require('axios');
const credentials = require('./credentials.json')

const clientId = credentials.client_id;
const clientSecret = credentials.client_secret;
const refreshToken = credentials.refresh_token


const generateToken = async () => {
    try {
        const tokenResponse = await axios.post('https://accounts.google.com/o/oauth2/token', {
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token'
        });

        console.log('Authorization successful!');
        return tokenResponse.data.access_token;

    } catch (error) {
        console.error('Authorization failed:', error);
    }
}

module.exports = generateToken