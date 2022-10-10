const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/", async (req, res) => {
  try {
    let browser = await puppeteer.launch({
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: false,
      ignoreHTTPSErrors: true,
    })
    let page = await browser.newPage()

    await page.goto(
      `https://nitter.net/archillect`, 
      {waitUntil: 'networkidle2'}
    )

    //grab last image in feed
    const src = await page.$eval(
      'div.timeline-container a.still-image > img',
      el => el.src
    )
  
    res.json({ src })

  } catch (err) {
    console.error(err)
    return null
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started")
});

module.exports = app;
