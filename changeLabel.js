const axios = require('axios');

const changeLabel = async (messageId, accessToken, userId = 'me') => {
    const labelName = 'Vacation Replies';
    console.log('Changing labels');
    try {
        const labels = (await axios.get(`https://www.googleapis.com/gmail/v1/users/${userId}/labels`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )).data.labels;

        let labelId;        
        for (const label of labels) {
            if (label.name === labelName) {
                labelId = label.id
            }
        }

        if (!labelId) {
            const label = await axios.post('https://www.googleapis.com/gmail/v1/users/me/labels', {
                name: labelName
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })            
            labelId = label.data.id;
        }        
        const response = await axios.post(
            `https://www.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/modify`,
            {
                removeLabelIds: ['UNREAD'],
                addLabelIds: [labelId],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(`Labels changed`);

    } catch (error) {
        console.error('Mark as read failed:', error.message);
    }
}

module.exports = changeLabel