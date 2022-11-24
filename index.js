const path = require("node:path");
const app = require("express")();
const { getRandom, getTv, getPost, getRecent } = require("./lib/utils");
const { client } = require("./lib/mongodb");
const cors = require("cors");

app.use(async (_, res, next) => {
  await client.connect();
  next();
});

app.use(cors());

app.get("/", async (_, res) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/random", async (_, res) => {
  try {
    const img = await getRandom();
    res.status(200).json(img);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/tv", async (_, res) => {
  try {
    const gif = await getTv();
    res.status(200).json(gif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/post/:postId", async (req, res) => {
  try {
    const img = await getPost(Number(req.params.postId));
    res.status(200).json(img);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/recent/:count", async (req, res) => {
  try {
    const count = Number(req.params?.count);
    const imgs = await getRecent(count);
    res.status(200).json(imgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
