const app = require("express")();
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

app.get("/", async (req, res) => {
  try {
    const src = await getSrc()
    res.status(200).json({ src })
    
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message })
  }
})

app.listen(process.env.PORT)
module.exports = app