// https://github.com/michaelkitas/Puppeteer-Vercel
const app = require("express")();
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { getSrc, setSrc } = require("./lib/utils")

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

  return src
}

app.post("/refetch", async (req, res) => {
  try {
    const src = await scrapeImgUrl()
    await setSrc(src)
    
    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message })
  }
})

app.get("/", async (req, res) => {
  const src = await getSrc()
  res.status(200).json({ src })
})

app.listen(process.env.PORT)
module.exports = app