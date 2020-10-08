const { events, Job } = require('brigadier');

events.on('push', (e, p) => {

    console.log(`NEW PUSH!!! ${JSON.stringify(e)}`);

    const jobTesting = new Job('job-testing', 'node:12-alpine');
    jobTesting.tasks = [
        'cd /src',
        'npm install',
        'npm run test'
    ];
    jobTesting.streamLogs = true;
    jobTesting.run();

});

