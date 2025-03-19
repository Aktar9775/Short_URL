const mongo=require('mongoose');
async function connectMongoDB(url) {
  return mongo.connect(url)
}
module.exports={
  connectMongoDB
}