const express = require('express');
const app = module.exports = express();
const puppeteer = require('puppeteer');
const htcrawl = require('htcrawl');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const request = require('request');
const util = require('util');
const options = {
  logLevel: 'info'
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * This is the route to take a full screenshot of a website, this means that it will take a screenshot of everything that is on the site.
 * @name Website Screenshot
 * @route {POST} /screenshot
 * @bodyparam {string} websiteLink This is the link of the website you want to take a screenshot of
 * @return {image} This will return a PNG of the screenshot taken.
 */
app.post('/screenshot', async function(req, res) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 1080, height: 1920});
  await page.goto(req.body.websiteLink, {waitUntil: 'networkidle0', timeout: 60000});
  await page.waitFor(10000);
  await page.screenshot({path: 'fullpageScreenshot.png', fullPage: true});

  await browser.close();
  res.sendFile(path.dirname(require.main.filename) + "\\fullpageScreenshot.png")
})

app.post('/diagnostics', async function(req, res) {
  const chrome = await chromeLauncher.launch(options);
  options.port = chrome.port;

  const resp = await util.promisify(request)(`http://localhost:${options.port}/json/version`);
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl, headless: 1 });

    const { lhr } = await lighthouse(req.body.websiteLink, options, null);
    await browser.disconnect();
    await chrome.kill();

    const html = reportGenerator.generateReport(lhr, 'html');
    fs.writeFile('report.html', html, function (err) {
      if (err) throw err;
    });
    res.sendFile(path.dirname(require.main.filename) + "\\report.html")
    //Not sending, Error: Parse Error: Expected HTTP postman
})

app.get('/webscraper', function(req, res) {

})

/**
 * This is the route that checks if a website is vulnerable to XSS attacks.
 * @name XSS checker
 * @route {POST} /vulnerabilites
 * @bodyparam {string} websiteLink This is the link of the website you want to test for XSS vulnerabilites.
 * @return {string} This will return a string of if it is vulnerable or not, if it is it will also send what it is vulnerable to (text area or URL manipulation) and how.
 * @todo I need to see if it's possible to use a VPN or proxy here, both of those options change or hide the IP address of the computer, which would make it impossible to reach the API via the IP address.
 */
app.post('/vulnerabilites', function(req, res) {
  const targetUrl = req.body.websiteLink
  const options = {headlessChrome:1};
  var pmap = {};

  const payloads = [
      ";window.___xssSink({0});",
      "<img src='a' onerror=window.___xssSink({0})>"
  ];

  function getNewPayload(payload, element){
      const k = "" + Math.floor(Math.random()*4000000000);
      const p = payload.replace("{0}", k);
      pmap[k] = {payload:payload, element:element};
      return p;
  }

  async function crawlAndFuzz(payload){
    var hashSet = false;

    const crawler = await htcrawl.launch(targetUrl, options);

    crawler.page().exposeFunction("___xssSink", key => {
      const msg = `DOM XSS found:\n  payload: ${pmap[key].payload}\n  element: ${pmap[key].element}`
      res.send(msg);
    });

    crawler.on("fillinput", async function(e, crawler){
      const p = getNewPayload(payload, e.params.element);
      try {
        await crawler.page().$eval(e.params.element, (i, p) => i.value = p, p);
      } catch(e) {}
      return false;
    });

    crawler.on("triggerevent", async function(e, crawler){
      if(!hashSet){
        const p = getNewPayload(payload, "hash");
        await crawler.page().evaluate(p => document.location.hash = p, p);
        hashSet = true;
      }
    });

    try {
      await crawler.start();
    } catch(e){
      res.send(`Error ${e}`);
    }

    crawler.browser().close();
  }

  (async () => {
    for(let payload of payloads){
      await crawlAndFuzz(payload);
    }
  })();
})
