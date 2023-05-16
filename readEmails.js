const axios = require('axios');
const generateToken = require('./generateToken')
const changeLabel = require('./changeLabel');
const sendReply = require('./sendReply')

const processThreads = async (uniqueThreads, accessToken) => {
    for (const threadId of uniqueThreads) {
        const threadResponse = (await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })).data

        if (threadResponse.messages && threadResponse.messages.length <= 1) {
            await sendReply(threadId, accessToken)
            await changeLabel(threadId, accessToken)
        }
    }
}

const readEmails = async () => {
    const accessToken = await generateToken()
    console.log('Reading Emails');
    try {
        const getMails = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const mails = getMails.data.messages;

        if (!mails || mails.length === 0) {
            console.log('No new emails.');
            return;
        }

        let threadIds = mails.map(mail => mail.threadId)
        const set = new Set(threadIds)
        const uniqueThreads = [...set]

        console.log('Emails read successfully');

        await processThreads(uniqueThreads, accessToken);

    } catch (error) {
        console.error('Reading mail failed:', error);
    }
}

module.exports = readEmails