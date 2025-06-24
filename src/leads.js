const axios = require('axios');
const dotenv = require('dotenv');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

dotenv.config();


const oauth = OAuth({
  consumer: {
    key: process.env.API_KEY,
    secret: process.env.API_SECRET_KEY,
  },
  signature_method: 'HMAC-SHA1',
  //creating the signature
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

const token = {
  key: process.env.ACCESS_TOKEN,
  secret: process.env.ACCESS_TOKEN_SECRET,
};



async function fetchLeadsFromTweet(tweetId,limit = 20) {

  const params = new URLSearchParams({
    'max_results':limit
  }).toString();
  const url = `https://api.twitter.com/2/tweets/${tweetId}/liking_users?${params}`;

  const requestData = {
    url,
    method: 'GET',
  };

  try {
    const res = await axios.get(
      url,
      {
        headers: {
        ...oauth.toHeader(oauth.authorize(requestData, token)),
        },
      }
      );
    console.log(res.data.data);
    const leads = res.data.data.map((user) => ({
      content : `${user.name} with username : ${user.username} liked the post related to Dev`,
      filename : "likes",
      fileType: "string",
      fileSize: 120,
      lastModified : "June 24, 2025",
    }));

    const lead =
    {
      "user_id": "KhushiMhasange",
      "organization_id": "Personal",
      "documents": leads,
      "source": "x.com",
      "context_type": "resource",
      "scope": "internal",
      "metadata": { 
         "fileName": "leads from twitter on post about Dev",
          "fileType": "string",
          "fileSize": 1024,
          "lastModified": "June 24, 2025",
      }
    }

    return lead;
  } catch (err) {
    console.error("Error fetching leads:", err.response?.data || err.message);
    return [];
  }
}

module.exports = { fetchLeadsFromTweet };
