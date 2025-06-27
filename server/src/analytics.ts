import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

interface ContextResult {
  contextData: string;
}

router.get('/analytics', async (req: Request, res: Response) => {
  const topic = req.query.topic as string;

  if (!topic) return res.status(400).json({ error: 'Missing topic query param' });

  try {
    const alchemystRes = await axios.post<{ results: ContextResult[] }>(
      process.env.CONTEXT_PROCESSOR_API_SEARCH!,
      {
        "query": "lead data",
        "similarity_threshold": 0.8,
        "minimum_similarity_threshold": 0.5,
       "scope": "internal",
       "metadata": {fileName: `fetching data on topic ${topic}`,
        fileType: 'string',
        fileSize: 1024,
        lastModified: 'June 24, 2025',}
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTEXT_PROCESSOR_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Res from alchemyst",alchemystRes);
    const counts: Record<string, number> = {};

    for (const item of alchemystRes.data.results) {
    const content = item.contextData.toLowerCase();

    if (content.includes(topic.toLowerCase())) {
        counts[topic] = (counts[topic] || 0) + 1;
    } else {
        counts["Others"] = (counts["Others"] || 0) + 1;
    }
    }

    // Format for chart usage
    const chartData = Object.entries(counts).map(([label, value]) => ({
    name: label,
    value,
    }));


    res.json(chartData);
  } catch (err) {
    console.error('Analytics fetch failed:',err);
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

export default router;
