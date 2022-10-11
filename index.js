// https://github.com/michaelkitas/Puppeteer-Vercel
const app = require("express")();
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const JSONdb = require('simple-json-db')
const { join, dirname } = require("node:path")
const { fileURLToPath } = require('node:url')

const _dirname = dirname(fileURLToPath(import.meta.url))
console.log(dirname)

const db = new JSONdb(join(_dirname, '/db.json'))
console.log(dirname)

const scrapeImgUrl = async () => {
  let browser = await puppeteer.launch({
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath,
    headless: true,
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

  db.set({ src })
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
  res.json({ src: db.get("src") || "" })
})

app.listen(process.env.PORT)
module.exports = app