const puppeteer = require('puppeteer');
let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:4000');
});

afterEach(async () => {
    browser.close();
});

test('Launches OAuth Flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

// Test to mimick the Oauth flow and assign the session and session.sig to a cookie
test('Hello User is displayed after login', async () => {
    // Using my own MongoDB id
    const id = '5e925084387aa43a5c6de5a8';
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };
    // Convert session object to a base64 string
    const sessionString = Buffer.from(
        JSON.stringify(sessionObject))
        .toString('base64');
    const Keygrip = require('keygrip');
    const cookieKey = '123123123';
    const keygrip = new Keygrip([cookieKey]);
    // Use the cookie key and keygrip to create the session signature
    const sig = keygrip.sign('session=' + sessionString);
    // Set the session and session signature as cookies
    await page.setCookie({name: 'session', value: sessionString});
    await page.setCookie({name: 'session.sig', value: sig});
});

