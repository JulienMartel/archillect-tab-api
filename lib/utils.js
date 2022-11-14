const { client } = require("./mongodb");
const getSrc = async () => {
  try {
    await client.connect();
    const db = client.db("main");

    // @ts-ignore
    const { src } = await db.collection("archillect-api").findOne({});

    return src;
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
};

module.exports = {
  getSrc,
};
