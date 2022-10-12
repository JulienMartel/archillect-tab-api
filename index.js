const app = require("express")();
// const cors = require('cors')
const { getSrc, setSrc, scrapeImgUrl } = require("./lib/utils")

app.post("/refetch", async (req, res) => {
  try {
    const src = await scrapeImgUrl()
    await setSrc(src)

    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message })
  }
})

app.get("/",async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  try {
    const src = await getSrc()
    res.status(200).json({ src })
    
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message })
  }
})

app.listen(process.env.PORT)
module.exports = app