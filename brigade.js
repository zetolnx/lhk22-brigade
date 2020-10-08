const { events, Job } = require('brigadier');

const generateJobtesting = (e, p) => {

    const jobTesting = new Job('job-testing', 'node:12-alpine');
    jobTesting.tasks = [
        'cd /src',
        'npm install',
        'npm run test'
    ];
    jobTesting.streamLogs = true;
    return jobTesting;

}

const checkRequest = (e, p) => {

    const imageName = 'brigadecore/brigade-github-check-run:latest';

    const commonEnv = {
        CHECK_PAYLOAD: e.payload,
        CHECK_NAME: "Brigade",
        CHECK_TITLE: "Running Tests",
    };

    const jobStartTest = new Job('start', imageName);
    jobStartTest.env = {
        ...commonEnv,
        CHECK_SUMMARY: 'Iniciando tests'
    };

    const jobFinishTest = new Job('finish', imageName);
    jobFinishTest.env = commonEnv;

    jobStartTest.run().then(() => {

        return generateJobtesting(e, p).run();

    }).then(result => {

        console.log('RESULT ', result);
        jobFinishTest.env.CHECK_SUMMARY = 'Tests finalizados con éxito.'
        jobFinishTest.env.CHECK_CONCLUSION = 'success';
        jobFinishTest.run();

    }).catch(err => {

        console.error('ERROR ', err.message);
        jobFinishTest.env.CHECK_SUMMARY = 'Tests finalizados sin éxito.'
        jobFinishTest.env.CHECK_CONCLUSION = 'failure';
        jobFinishTest.run();

    });

};

/* events.on('push', (e, p) => {

    console.log(`NEW PUSH!!! ${JSON.stringify(e)}`);

});
 */
events.on("check_suite:rerequested", checkRequest);
events.on("check_suite:requested", checkRequest);

events.on('pull_request:opened', (e, p) => {

    const jobSlack = new Job('slack', 'technosophos/slack-notify:latest');

    jobSlack.env = {
        SLACK_WEBHOOK: p.secrets.SLACK_WEBHOOK,
        SLACK_USERNAME: "Brigade",
        SLACK_TITLE: "Nuevo PR",
        SLACK_MESSAGE: "Nuevo PR ha llegado",
        SLACK_COLOR: "#FF00FF"
    };

    jobSlack.run();

});