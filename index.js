const app = require("express")();
const cron = require('node-cron');
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

let imgUrl = ""

const scrapeImgUrl = async () => {
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

  imgUrl = src
  return null
}

app.get("/", async (req, res) => {
  res.json({ imgUrl })
})

const init = async () => {
  await scrapeImgUrl()

  cron.schedule('*/10 * * * *', async () => {
    await scrapeImgUrl()
  })

  app.listen(process.env.PORT)
}

init()




module.exports = app