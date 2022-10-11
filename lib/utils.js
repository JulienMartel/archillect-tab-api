const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const { client } = require("./mongodb")

const setSrc = async src => {
  await client.connect()
  try {
    const db = client.db("main")
    
    await db
      .collection("archillect-api")
      .replaceOne({}, { src })
    console.log('test')

    return null
  } catch (e) {
    console.error(e);
  } finally {
    client.close()
  }
}

const getSrc = async () => {
  await client.connect()
  try {
    const db = client.db("main")

    const { src } = await db
      .collection("archillect-api")
      .findOne({})

    return src
  } catch (e) {
    console.error(e)
  } finally {
    client.close()
  }
}

// have to do it like this cause vercel hosting
// https://github.com/michaelkitas/Puppeteer-Vercel
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

module.exports = {
  getSrc,
  setSrc,
  scrapeImgUrl
}