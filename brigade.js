const { events, Job } = require('brigadier');

events.on('push', (e, p) => {

    console.log(`NEW PUSH!!! ${e}`);

})
