// https://github.com/michaelkitas/Puppeteer-Vercel
const app = require("express")();
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

app.post("/refetch", async (req, res) => {
  try {
    await scrapeImgUrl()
    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message })
  }
})

app.get("/", async (req, res) => {
  res.json({ imgUrl })
})

app.listen(process.env.PORT)
module.exports = app