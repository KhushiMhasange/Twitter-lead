import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fetchLeadsFromTweet } from './leads';
import { fetchRecentTweets } from './recentTweets';
import { sendLeadsToContextProcessor } from './alchemystClient';
import analyticsRoutes from './analytics';


dotenv.config();

const app = express();
app.use(cors());
const PORT = 4000;

app.use(analyticsRoutes);

app.get('/capture-leads', async (req: Request, res: Response) => {
  const tweetId = req.query.tweetId as string;
  if (!tweetId) return res.status(400).send("Missing tweetId");

  try {
    const leads = await fetchLeadsFromTweet(tweetId);
    await sendLeadsToContextProcessor(leads);
    res.send(leads);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/twitter/search/recent', async (req: Request, res: Response) => {
  const queryParam = req.query.query as string;

  if (!queryParam) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const username = 'KhushiMhasange'; 
  const query = `${queryParam} from:${username}`;

  try {
    const { tweets, users } = await fetchRecentTweets(query);

    const TweetsWithUser = tweets.map(tweet => {
      const user = users.find(u => u.id === tweet.author_id);
      return {
        ...tweet,
        username: user?.username,
        name: user?.name,
        profile_image_url: user?.profile_image_url,
      };
    });

    res.json(TweetsWithUser);
  } catch (err) {
    console.error('Failed to fetch tweets:', err);
    res.status(500).json({ error: 'Error fetching tweets' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




