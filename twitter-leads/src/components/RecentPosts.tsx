import { useState, useCallback } from 'react';
import axios from 'axios';

interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
  };
}

interface tweetsData {
  data: Tweet[];
  includes?: {
    users?: {
      id: string;
      name:string;
      username: string;
      profile_image_url: string;
    }[];
  };
}

export default function RecentPosts() {
  const [queryInput, setQueryInput] = useState('');
  const [fetchedTweets, setFetchedTweets] = useState<Tweet[]>([]);
  const [userMap, setUserMap] = useState<Record<string, { username: string; profile_image_url: string }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentTweets = useCallback(async () => {
    if (!queryInput.trim()) {
      setError('Please enter a search query (e.g., a keyword or hashtag).');
      setFetchedTweets([]);
      return;
    }

    setLoading(true);
    setError(null);
    setFetchedTweets([]);

    try {
      const res = await axios.get<tweetsData>('http://localhost:4000/twitter/search/recent', {
        params: {
          query: queryInput,
          max_results: 10,
        },
      });

      if (res.data && res.data.data) {
        const tweets = res.data.data;

        const users = res.data.includes?.users || [];
        console.log(users);
        const map: Record<string, { username: string; profile_image_url: string }> = {};
        users.forEach((user) => {
          map[user.id] = {
            username: user.username,
            profile_image_url: user.profile_image_url,
          };
        });

        setUserMap(map);
        setFetchedTweets(tweets);
      } else {
        setFetchedTweets([]);
        setError('No recent tweets found for this query.');
      }
    } catch (err: unknown) {
      console.error('Failed to fetch recent tweets:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.detail) {
          setError(`Error: ${err.response.data.detail}`);
        } else if (err.message) {
          setError(`Failed to fetch recent tweets: ${err.message}`);
        }
      } else {
        setError('Failed to fetch recent tweets. Please try again.');
      }
      setFetchedTweets([]);
    }

    setLoading(false);
  }, [queryInput]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 flex flex-col items-center font-inter">
      <h1 className="text-3xl font-bold text-teal-400 mb-8 mt-4 rounded-lg p-2 shadow-lg">
        Fetch Recent Tweets
      </h1>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4">
        <label htmlFor="query" className="text-zinc-300 text-lg font-medium">
          Search Query (Keyword/Hashtag):
        </label>
        <input
          type="text"
          id="query"
          className="w-full p-3 rounded-md bg-zinc-700 border border-zinc-600 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 text-white placeholder-zinc-400 text-lg"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="e.g., #webdev or AI agents"
          aria-label="Tweet search query input"
        />
        <button
          onClick={fetchRecentTweets}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105
                     disabled:bg-zinc-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={loading}
          aria-live="polite"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Searching Tweets...' : 'Search Recent Tweets'}
        </button>
      </div>

      <div className="mt-8 w-full max-w-2xl bg-zinc-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-teal-300 mb-4 border-b border-zinc-700 pb-2">
          Recent Tweets
        </h2>

        {error && (
          <div role="alert" className="bg-red-900 text-red-200 p-3 rounded-md mb-4 border border-red-700">
            Error: {error}
          </div>
        )}

        {!fetchedTweets.length && !loading && !error && (
          <p className="text-zinc-400 text-center">Enter a query and click "Search Recent Tweets" to see results.</p>
        )}

        {fetchedTweets.map((tweet) => {
          const user = userMap[tweet.author_id];
          return (
            <div key={tweet.id} className="bg-zinc-700 p-5 rounded-md mb-4 shadow-inner">
              <div className="flex items-start gap-3 mb-2">
                {user?.profile_image_url && (
                  <img
                    src={user.profile_image_url}
                    alt={`${user.username}'s profile`}
                    className="w-10 h-10 rounded-full border-2 border-teal-500"
                  />
                )}
                <div>
                  <p className="font-semibold text-teal-300">@{user?.username || 'Unknown'}</p>
                  <p className="text-zinc-400 text-sm">{new Date(tweet.created_at).toLocaleString()}</p>
                </div>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'Lato, sans-serif'}} className="text-left p-1">{tweet.text}</pre>
              <div className="text-zinc-400 text-sm flex gap-8 pt-4">
                <span>❤️ {tweet.public_metrics.like_count}</span>
                <span>💬 {tweet.public_metrics.reply_count}</span>
                <span>🔁 {tweet.public_metrics.retweet_count}</span>
                <span>🗣️ {tweet.public_metrics.quote_count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
