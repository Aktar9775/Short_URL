const mongo=require('mongoose');
async function connectMongoDB(url) {
  return mongo.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
module.exports={
  connectMongoDB
}