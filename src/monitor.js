"use strict";

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36';
const safeHeaders = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': userAgent
};

const request = require('request-promise').defaults({
    simple: false,
    gzip: true,
    resolveWithFullResponse: true,
    maxRedirects: 0,
    followRedirect: false,
    headers: safeHeaders
});
const crypto = require('crypto');
const cheerio = require('cheerio');
const events = require('events');

const {
    sleep,
    formatProxy
} = require('./utils/tools');

const config = require('../user/config.json');

class Monitor extends events {
    constructor() {
        super();

        this.previousLoop = [];
        this.currentLoop = [];

        this.proxies = [];

        this.updateInterval = null;

        this.initProxies();
    }

    initProxies = async () => {
        require('fs').readFileSync(__dirname + '/../user/proxies.txt', 'utf-8')
            .split(/\r?\n/).forEach(line => this.proxies.push(line));

        this.initMonitor();
    }

    initMonitor = async () => {
        console.log('Initializing Monitor...');
        
        if (this.proxies.length == 0) return console.log('ERR: Please add proxies.');

        if (!config.delay || !config.webhook) return console.log('ERR: Please configure your config.json');

        try {            
            let response = await request({
                url: 'https://www.supremenewyork.com/shop/all',
                proxy: this.getProxy()
            })
    
            let $ = cheerio.load(response.body);

            /**
             * Cool little way to wait for the loop to finish ;)
             */

            let promiseList = [];
    
            $('script').each(async (i, e) => {
                if (!e.attribs['src']) return;
    
                let _shaChecksum = async (_this) => {
                    let shaChecksum = await _this.getChecksum(e.attribs[ 'src' ]);

                    // @DEBUG: console.log(shaChecksum, ' - ', e.attribs[ 'src' ]);
        
                    await _this.previousLoop.push({
                        url: e.attribs[ 'src' ],
                        shaChecksum: shaChecksum
                    });
                }

                promiseList.push(_shaChecksum(this));
            })

            Promise.all(promiseList)
                .then(() => {
                    console.log('Monitoring...');

                    if (!this.updateInterval)
                        this.updateInterval = setInterval(() => 
                                console.log(`Still Here @ ${new Date().toISOString()}`)
                                , 1800000);
                                
                    return this.monitorLoop();
                })
                
        } catch (e) {
            console.log(`ERR: ${e.message}`);
            await sleep(config.delay);
            return this.initMonitor();
        }
    }

    monitorLoop = async () => {
        try {
            let response = await request({
                url: 'https://www.supremenewyork.com/shop/all',
                proxy: this.getProxy()
            })
    
            let $ = cheerio.load(response.body);

            /**
             * Cool little way to wait for the loop to finish ;)
             */

            let promiseList = [];
    
            $('script').each(async (i, e) => {
                if (!e.attribs['src']) return;
    
                let _shaChecksum = async (_this) => {
                    let shaChecksum = await _this.getChecksum(e.attribs[ 'src' ]);

                    // @DEBUG: console.log(shaChecksum, ' - ', e.attribs[ 'src' ]);

                    let currentScript = {
                        url: e.attribs[ 'src' ],
                        shaChecksum: shaChecksum
                    }

                    await _this.currentLoop.push(currentScript);

                    let matchedScript = _this.previousLoop.find(script => script.url == currentScript.url);

                    if (!matchedScript)
                        _this.emit('added', currentScript);
                    else if (matchedScript.shaChecksum != currentScript.shaChecksum)
                        _this.emit('edited', currentScript);
                }

                promiseList.push(_shaChecksum(this));
            })

            Promise.all(promiseList)
                .then(async () => {    
                    await this.previousLoop.forEach(async previousScript => {
                        let removedScript = this.currentLoop.find(script => script.url == previousScript.url);

                        if (!removedScript)
                            this.emit('removed', previousScript);
                    })

                    this.previousLoop = this.currentLoop;
                    this.currentLoop = [];

                    await sleep(config.delay);
                    return this.monitorLoop();
                })
                
        } catch (e) {
            console.log(`ERR: ${e.message}`);
            await sleep(config.delay);
            return this.initMonitor();
        }
    }

    getChecksum = async URL => {
        try {
            let shaChecksum;
        
            URL = (URL.startsWith('//')) ? 'https:' + URL : URL;
            URL = (!URL.startsWith('http')) ? 'https://www.supremenewyork.com' + URL : URL;

            let response = await request({
                url: URL,
                proxy: this.getProxy()
            })

            shaChecksum = crypto.createHash('sha256')
                                .update(response.body)
                                .digest('hex');

            return shaChecksum;
        } catch (e) {
            console.log(`ERR: ${e.message}`);
            await sleep(config.delay);
            return this.getChecksum();
        }
    }

    getProxy = () => {
        return formatProxy(
                    this.proxies[Math.floor(Math.random() * this.proxies.length)]
                );
    }
}

module.exports = Monitor;