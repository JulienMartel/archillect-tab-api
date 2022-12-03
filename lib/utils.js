const { client } = require("./mongodb");

const collection = client.db("images").collection("archive");

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

const getPost = async (postId) => {
  const [post] = await collection.find({ postId }).toArray();

  if (!post) throw new Error("Post not found");

  return post;
};

const getRecent = async (count) => {
  if (count > 10) {
    throw new Error("Count must be 10 or less");
  }

  const posts = await collection
    .find()
    .sort({ postId: -1 })
    .limit(count)
    .toArray();

  return posts;
};

module.exports = {
  getRandom,
  getTv,
  getPost,
  getRecent,
};
