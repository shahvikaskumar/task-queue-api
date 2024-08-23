const cluster = require('cluster');
const os = require('os');
const express = require('express');
const { processtask} = require('./components/taskprocessor');
const { ratelimiter } = require('./components/ratelimiter');

if(cluster.isMaster){
    
    // Fork worker processes for each CPU core
    const numcpu = os.cpus().length;
    for(let i=0; i< numcpu; i++){
        cluster.fork();
    }

    // Restart a worker if it dies
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new Worker...`);
        cluster.fork();
    });
}
else {

    // Setup Express server in worker processes
    const app = express();
    const PORT = process.env.port || 5000;

    app.use(express.json());

    // Handle task processing with rate limiting
    app.post('/api/v1/task', async(req,res) => {
        const {user_id} = req.body;

        const canproceed = await ratelimiter(user_id);
        if (canproceed){
            processtask(user_id);
            res.status(202).send({message:'Task is being processed.'});
        }
        else {
            res.status(429).send({message:'Too many requests. Your Task is queued.'});
        }
    });

    // Start server and log worker PID
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} listening on port ${PORT}`);
    });
}