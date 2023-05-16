const readEmails = require('./readEmails')

function checkEmailsPeriodically(minInterval = 45, maxInterval = 120) {

    const interval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    console.log(`The next scan for emails will begin after ${interval}`);    
    setTimeout(async () => {
        await readEmails();
        checkEmailsPeriodically();
    }, interval * 1000);
}
    
checkEmailsPeriodically(0,1);
