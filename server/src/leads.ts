import axios from 'axios';
import dotenv from 'dotenv';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

dotenv.config();

const oauth = new OAuth({
  consumer: {
    key: process.env.API_KEY || '',
    secret: process.env.API_SECRET_KEY || '',
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string: string, key: string): string {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
})

const token = {
  key: process.env.ACCESS_TOKEN || '',
  secret: process.env.ACCESS_TOKEN_SECRET || '',
};

interface Tweet {
  id: string;
  text: string;
}

interface User {
  name: string;
  username: string;
}

interface LeadDocument {
  content: string;
  filename: string;
  fileType: string;
  fileSize: number;
  lastModified: string;
}

interface Lead {
  user_id: string;
  organization_id: string;
  documents: LeadDocument[];
  source: string;
  context_type: string;
  scope: string;
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    lastModified: string;
  };
}


export async function fetchLeadsFromTweet(tweetId: string, limit: number = 20): Promise<Lead | []> {
  const params = new URLSearchParams({
    max_results: limit.toString(),
  }).toString();

  const url = `https://api.twitter.com/2/tweets/${tweetId}/liking_users?${params}`;

  const requestData = {
    url,
    method: 'GET' as const,
  };

  try {
    const res = await axios.get(url, {
      headers: {
        ...oauth.toHeader(oauth.authorize(requestData, token)),
      },
    });

    const leads: LeadDocument[] = res.data.data.map((user: User) => ({
      content: `${user.name} with username : ${user.username} liked the post related to Dev`,
      filename: 'likes',
      fileType: 'string',
      fileSize: 120,
      lastModified: 'June 24, 2025',
    }));

    const lead: Lead = {
      user_id: 'KhushiMhasange',
      organization_id: 'Personal',
      documents: leads,
      source: 'x.com',
      context_type: 'resource',
      scope: 'internal',
      metadata: {
        fileName: `leads from twitter ID ${tweetId}`,
        fileType: 'string',
        fileSize: 1024,
        lastModified: 'June 24, 2025',
      },
    };

    return lead;
  } catch (err: any) {
    console.error('Error fetching leads:', err.response?.data || err.message);
    return [];
  }
}

