const request = require('request-promise');

const config = require('../../user/config.json');

const {
    sleep
} = require('../utils/tools.js');

let embedTemplate = {
    embeds: [{
        color: null,
        title: null,
        author: {
            name: 'Made with <3 by Rock @ StormeIO',
            icon_url: 'https://i.imgur.com/e5vzoUb.png'
        },
        fields: [
            {
                name: 'Site',
                value: 'Supreme',
            },
            {
                name: 'Script URL',
                value: null,
            },
            {
                name: 'Script SHA256 Checksum',
                value: null,
            },
        ],
        timestamp: new Date(),
        footer: {
            text: 'Made with <3 by Rock @ StormeIO',
            icon_url: 'https://i.imgur.com/e5vzoUb.png',
        },
    }]
}

module.exports = {
    added: async newScript => {
        try {
            embedTemplate.color = 1305395;
            embedTemplate.title = 'New Script Added'
            embedTemplate.embeds[0].fields[1].value = newScript.url;
            embedTemplate.embeds[0].fields[1].value = newScript.shaChecksum;
    
            await request({
                url: config.webhook,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(embedTemplate)
            })
        } catch (e) {
            console.error(`ERR (WH): ${e.message}`);
            await sleep(config.delay);
            return module.exports.added(newScript);
        }
    },
    removed: async removedScript => {
        try {
            embedTemplate.color = 16722217;
            embedTemplate.title = 'Script Removed'
            embedTemplate.embeds[0].fields[1].value = removedScript.url;
            embedTemplate.embeds[0].fields[1].value = removedScript.shaChecksum;

            await request({
                url: config.webhook,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(embedTemplate)
            })
        } catch (e) {
            console.error(`ERR (WH): ${e.message}`);
            await sleep(config.delay);
            return module.exports.removed(removedScript);
        }
    },
    edited: async editedScript => {
        try {
            embedTemplate.color = 16769090;
            embedTemplate.title = 'Script Contents Edited'
            embedTemplate.embeds[0].fields[1].value = removedScript.url;
            embedTemplate.embeds[0].fields[1].value = removedScript.shaChecksum;
            
            await request({
                url: config.webhook,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(embedTemplate)
            })
        } catch (e) {
            console.error(`ERR (WH): ${e.message}`);
            await sleep(config.delay);
            return module.exports.removed(editedScript);
        }
    }
}