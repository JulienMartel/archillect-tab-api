const { client } = require("./mongodb");

const collection = client.db("images").collection("data");

const getRandom = async () => {
  const [img] = await collection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();

  return img;
};

const getTv = async () => {
  const [gif] = await collection
    .aggregate([
      { $match: { src: { $regex: /.*\.gif$/ } } },
      { $sample: { size: 1 } },
    ])
    .toArray();

  return gif;
};

const getPost = async (_id) => {
  const [post] = await collection.find({ _id }).toArray();

  if (!post) throw new Error("Post not found");

  return post;
};

const getRecent = async (count = 1) => {
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
