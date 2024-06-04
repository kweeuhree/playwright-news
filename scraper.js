//extract chromium
const { chromium } = require('playwright');
//enable interaction with file system
const fs = require('fs');

// url address
const url = 'https://news.ycombinator.com/';

//define and declare asynchronous function that takes url as an argument
const scrapeWebsite = async (url) => {
    //launch browser instance with visible window
    const browser = await chromium.launch();
    const context = await browser.newContext();
    //open new tab
    const page = await context.newPage();

    // go to the address
    await page.goto(url);

    // evaluate page
    const links = await page.evaluate(() => {
        // get all anchors that are children of 'titleline' spans
        const anchors = document.querySelectorAll('span.titleline > a');
        const result = []; //initialize result array

        // loopt through anchors
        anchors.forEach(anchor => {
            //if result array length is less than ten push new element
          result.length < 10 ? result.push( [anchor.innerHTML, anchor.href] ) : null;
        })
        //return result
        return result;
    });

    // convert to string via joining, join with new line for readability
    const csvData = links.join('\n');
    //write to file
    fs.writeFileSync('output.csv', csvData);

    //console log for sanity check
    console.log('Scraped CVS data: ', csvData);

    //close browser instance
    browser.close();
    
}

//invoke function immediately
(async () => {
    scrapeWebsite(url);
})();