import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || ''; 

interface TweetUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}


export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

export async function fetchRecentTweets(query: string, maxResults = 10): Promise<{ tweets: Tweet[]; users: TweetUser[] }> {
  const url = 'https://api.twitter.com/2/tweets/search/recent';

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
    params: {
    query,
    max_results: maxResults,
    'tweet.fields': 'author_id,created_at,public_metrics',
     expansions: 'author_id',
    'user.fields': 'name,username,profile_image_url',
    },
  });
 const tweets = response.data.data || [];
  const users = response.data.includes?.users || [];

  return { tweets, users };
}