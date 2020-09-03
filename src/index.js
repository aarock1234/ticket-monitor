const scriptMonitor = require('./monitor.js');
const webhookManager = require('./actions/webhook.js');

let currentMonitor = new scriptMonitor();

currentMonitor.on('added', script => webhookManager.added(script));
currentMonitor.on('removed', script => webhookManager.removed(script));
currentMonitor.on('edited', script => webhookManager.edited(script));