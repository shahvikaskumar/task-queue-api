const fs= require('fs');
const path = require('path');

// Function to log task completion details
function logtask(userid, timestamp){
    const logmsg = `${userid} - task completed at - ${new Date(timestamp).toISOString()}\n`;
    const logpath = path.join(__dirname, 'tasklog.txt');

    // Append the log message to the log file
    fs.appendFile(logpath, logmsg, (err) => {
        if(err) throw err;
    });
}

module.exports = { logtask};