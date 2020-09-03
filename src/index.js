const scriptMonitor = require('./monitor.js');
const webhookManager = require('./actions/webhook.js');

let currentMonitor = new scriptMonitor();

currentMonitor.on('added', script => {
    webhookManager.send(1305395, 'New Script Added', script);
    console.log('New Script')
});

currentMonitor.on('removed', script => {
    webhookManager.send(16722217, 'Script Removed', script);
    console.log('Script Removed')
});

currentMonitor.on('edited', script => {
    webhookManager.send(16769090, 'Script Contents Edited', script);
    console.log('Script Edited');
});