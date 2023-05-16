const axios = require('axios');

// Send a reply email
async function sendReply(threadId, accessToken) {
    console.log(`Sending reply to ${threadId}`);
    try {        
        const message = await createReplyMessage(threadId, accessToken);
        await sendMessage(message, accessToken);
        console.log('Reply sent successfully!');
    } catch (error) {
        console.error('An error occurred while sending the reply:', error);
    }
}

async function createReplyMessage(threadId, accessToken) {
    const reply = 'Thank you for your email. I am currently out of the station.';

    const { messageId, subject, from, to } = await getMessageDetails(threadId, accessToken);

    const message = [
        `Content-Type: text/plain; charset="UTF-8"`,
        `MIME-Version: 1.0`,
        `Content-Transfer-Encoding: 7bit`,
        `References: ${messageId}`,
        `In-Reply-To: ${messageId}`,
        `Subject: Re: ${subject}`,
        `To: ${to}`,
        `From: ${from}`,
        ``,
        reply,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return {
        raw: encodedMessage,
        threadId
    };
}

async function getMessageDetails(threadId, accessToken) {    

    const response = await axios.get(`https://www.googleapis.com/gmail/v1/users/me/messages/${threadId}`,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const { headers } = response.data.payload;
    let messageId, subject, from, to
    for (let header of headers) {
        if (header.name.toLowerCase() === "message-id") {
            messageId = header.value
        }
        if (header.name === "Subject") {
            subject = header.value
        }
        if (header.name === "To") {
            from = header.value
        }
        if (header.name === "From") {
            to = header.value
        }
    }

    return { messageId, subject, from, to };
}

// Send a message
async function sendMessage(message, accessToken) {
   
    await axios.post(`https://www.googleapis.com/gmail/v1/users/me/messages/send`,{
        raw: message.raw,
        threadId: message.threadId
    },{
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

module.exports = sendReply
   
