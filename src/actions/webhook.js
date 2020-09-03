const request = require('request-promise');

const config = require('../../user/config.json');

const {
    sleep
} = require('../utils/tools.js');

module.exports = {
    added: async newScript => {
        try {
            const embed = {
                "embeds": [{
                    color: 1305395,
                    title: 'New Script Added',
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
                            value: newScript.url,
                        },
                        {
                            name: 'Script SHA256 Checksum',
                            value: newScript.shaChecksum,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: 'Made with <3 by Rock @ StormeIO',
                        icon_url: 'https://i.imgur.com/e5vzoUb.png',
                    },
                }]
            }
    
            await request({
                url: config.webhook,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(embed)
            })
        } catch (e) {
            console.log(`ERR (WH): ${e.message}`);
            await sleep(config.delay);
            return module.exports.added(script);
        }
    },
    removed: async removedScript => {
        const embed = {
            "embeds": [{
                color: 16722217,
                title: 'Script Removed',
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
                        value: removedScript.url,
                    },
                    {
                        name: 'Script SHA256 Checksum',
                        value: removedScript.shaChecksum,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Made with <3 by Rock @ StormeIO',
                    icon_url: 'https://i.imgur.com/e5vzoUb.png',
                },
            }]
        }

        await request({
            url: config.webhook,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(embed)
        })
    },
    edited: async editedScript => {
        const embed = {
            "embeds": [{
                color: 16769090,
                title: 'Script Contents Edited',
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
                        value: editedScript.url,
                    },
                    {
                        name: 'Script SHA256 Checksum',
                        value: editedScript.shaChecksum,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Made with <3 by Rock @ StormeIO',
                    icon_url: 'https://i.imgur.com/e5vzoUb.png',
                },
            }]
        }

        await request({
            url: config.webhook,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(embed)
        })
    }
}