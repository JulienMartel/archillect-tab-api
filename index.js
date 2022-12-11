// @ts-nocheck
const path = require("node:path");
const app = require("express")();
const { getRandom, getTv, getPost, getRecent } = require("./lib/utils");
const { client } = require("./lib/mongodb");
const cors = require("cors");
const fetch = require("node-fetch");

const ifBase64 = async (img, isBase64, isGif) => {
  if (!isBase64) return img;

  const res = await fetch(img.src);
  const buffer = Buffer.from(await res.arrayBuffer());
  const src =
    `data:image/${isGif ? "gif" : "jpg"};base64,` + buffer.toString("base64");

  return { ...img, src };
};

const checkIsApiKeyValid = async (apiKey = "none-provided") => {
  try {
    const res = await fetch(
      "https://api.gumroad.com/v2/licenses/verify?product_permalink=aw&license_key=" +
        apiKey,
      { method: "POST" }
    );

    const json = await res.json();

    const {
      success,
      subscription_ended_at,
      subscription_cancelled_at,
      subscription_failed_at,
    } = json;

    return (
      success &&
      subscription_ended_at !== null &&
      subscription_cancelled_at !== null &&
      subscription_failed_at !== null
    );
  } catch (error) {
    return false;
  }
};

app.use(cors());

app.use(async (req, res, next) => {
  await client.connect();
  next();
});

app.use(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  const isValid = await checkIsApiKeyValid(apiKey);

  if (!isValid) {
    res.status(401).json({ error: "Invalid license key" });
    return;
  }

  next();
});

app.use((req, _, next) => {
  req.isBase64 = req.query.b64 === "true";
  next();
});

app.get("/", async (_, res) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/random", async (req, res) => {
  try {
    let img = await getRandom();
    img = await ifBase64(img, req.isBase64);

    res.status(200).json(img);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/tv", async (req, res) => {
  try {
    let gif = await getTv();
    gif = await ifBase64(gif, req.isBase64, true);

    res.status(200).json(gif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/post/:postId", async (req, res) => {
  try {
    let img = await getPost(Number(req.params.postId));
    img = await ifBase64(img, req.isBase64);

    res.status(200).json(img);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/recent/:count", async (req, res) => {
  try {
    const count = Number(req.params?.count);

    let imgs = await getRecent(count);
    imgs = await Promise.all(imgs.map((img) => ifBase64(img, req.isBase64)));

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
