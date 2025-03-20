require("dotenv").config();
const express= require('express');
const cors= require('cors')
const urlRoute=require('./routes/url')
const User=require('./routes/auth')
const URL = require('./models/url')
const {connectMongoDB}=require('./connect')
const MONGO_URL=process.env.MONGO_URL
const app=express();
connectMongoDB(MONGO_URL).then(()=>{
  console.log('Server running');
})
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://urlshortener-ebon.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json())

app.use('/url',urlRoute)
app.use('/user',User);
app.get('/', (req, res) => {
  res.json(`✅ Server is running on PORT ${PORT}`);
});

app.get('/:shortId',async(req,res)=>{
  const shortId=req.params.shortId;
  const entry=await URL.findOneAndUpdate({
    shortId ,
  },
  {
    $push:{
      visitHistory:{
        timestamp:Date.now(),
      }
     },
    })
    res.redirect(entry.redirectURL)
})

const PORT=process.env.PORT;
app.listen(PORT)
