const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config();
const { fetchLeadsFromTweet } = require('./leads');
const { sendLeadsToContextProcessor } = require('./alchemystClient');

const app = express();
const PORT = 3000;


app.get('/capture-leads', async (req, res) => {
  const tweetId = req.query.tweetId;
  if (!tweetId) return res.status(400).send("Missing tweetId");
  try{
  const leads = await fetchLeadsFromTweet(tweetId);
  if(leads) res.send({ message: "Leads captured and sent!", leads });
  await sendLeadsToContextProcessor(leads);
  }catch(err){
    console.log(err);
  }
});

// async function fetchTweetId(){
//     try{
//          const res = await axios.get(
//       "https://api.twitter.com/2/tweets/search/recent",
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
//         },
//         params: {
//           query: "from:KhushiMhasange",
//           max_results: 5,
//         },
//       }
//         )
//         const tweets = res.data.data.map(tweet => ({
//         id: tweet.id,
//         text: tweet.text,
//         }));
//         console.log(tweets);
//     }catch(err){
//       console.error("Error retrieving tweets :",err);
//     }
// }

// fetchTweetId();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
