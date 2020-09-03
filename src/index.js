const scriptMonitor = require('./monitor.js');
const webhookManager = require('./actions/webhook.js');

return webhookManager.added({
    url: 'https://www.example.com',
    shaChecksum: '4128d163becca8bccabd6a9f8fe8e603e630432f133fe67fd779cc64534bca27'
});

let currentMonitor = new scriptMonitor();

currentMonitor.on('added', script => webhookManager.added(script));
currentMonitor.on('removed', script => webhookManager.removed(script));
currentMonitor.on('edited', script => webhookManager.edited(script));