const app = require("express")();
const { getSrc } = require("./lib/utils");

app.get("/", async (_, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  try {
    const src = await getSrc();
    res.status(200).json({ src });
  } catch (err) {
    return res.status(500).json({ statusCode: 500, message: err.message });
  }
});

app.listen(process.env.PORT);

module.exports = app;
