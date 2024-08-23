const {logtask} = require('./tasklogger');

// Function to process a task for a specific user
async function processtask(userid){
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const timestamp = Date.now();
    console.log(`${userid} - task completed at - ${timestamp}`);
    logtask(userid, timestamp);
}

module.exports = { processtask};