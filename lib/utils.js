const { clientPromise } = require("./mongodb")

const setSrc = async src => {
  const client = await clientPromise
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
  const client = await clientPromise
  console.log(client)
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

module.exports = {
  getSrc,
  setSrc
}