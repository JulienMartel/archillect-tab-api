const { client } = require("./mongodb");

const getCollection = async () => {
  await client.connect();
  return client.db("images").collection("data");
};

const getRandom = async () => {
  console.log("test");
  const collection = await getCollection();
  console.log("got collection");

  const [img] = await collection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();

  console.log("got image");
  return img;
};

const getTv = async () => {
  const collection = await getCollection();

  const [gif] = await collection
    .aggregate([
      { $match: { src: { $regex: /.*\.gif$/ } } },
      { $sample: { size: 1 } },
    ])
    .toArray();

  return gif;
};

const getPost = async (_id) => {
  const collection = await getCollection();

  const [post] = await collection.find({ _id }).toArray();

  if (!post) throw new Error("Post not found");

  return post;
};

const getRecent = async (count = 1) => {
  const collection = await getCollection();

  if (count > 100) {
    throw new Error("Count must be less than 100");
  }
  const posts = await collection
    .find()
    .sort({ _id: -1 })
    .limit(count)
    .toArray();

  return count > 1 ? posts : posts[0];
};

module.exports = {
  getRandom,
  getTv,
  getPost,
  getRecent,
};
