import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fetchLeadsFromTweet } from './leads';
import { sendLeadsToContextProcessor } from './alchemystClient';

dotenv.config();

const app = express();
app.use(cors());
const PORT = 4000;

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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




