const mongo=require('mongoose');
async function connectMongoDB(url) {
  return mongo.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
     connectTimeoutMS: 10000,
  })
}
module.exports={
  connectMongoDB
}
