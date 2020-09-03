const scriptMonitor = require('./monitor.js');
const webhookManager = require('./actions/webhook.js');

let currentMonitor = new scriptMonitor();

currentMonitor.on('added', script => {
    webhookManager.added(script);
    console.log('New Script')
});

currentMonitor.on('removed', script => {
    webhookManager.removed(script);
    console.log('Script Removed')
});

currentMonitor.on('edited', script => {
    webhookManager.edited(script);
    console.log('Script Edited');
});