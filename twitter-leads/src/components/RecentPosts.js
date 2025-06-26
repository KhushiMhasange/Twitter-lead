import { useState, useCallback } from 'react';
import axios from 'axios';

const axiosInstance = {
    get: (url, config) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const queryParam = config?.params?.query || '';
                const maxResults = config?.params?.max_results || 10;

                const mockTweets = [
                    {
                        id: "1000000000000000001",
                        text: `This is a recent tweet about ${queryParam || "web development"}! #coding`,
                        user: {
                            name: "CodeMaster",
                            username: "codemaster",
                            profile_image_url_https: "https://placehold.co/40x40/4CAF50/FFFFFF?text=CM",
                        },
                        created_at: new Date(Date.now() - 3600000).toISOString(),
                        public_metrics: { like_count: 50, reply_count: 5, retweet_count: 10, quote_count: 1 },
                        extended_entities: null,
                    },
                    {
                        id: "1000000000000000002",
                        text: `Excited about new AI advancements based on ${queryParam || "AI"}! #AI`,
                        user: {
                            name: "AI Enthusiast",
                            username: "aifan",
                            profile_image_url_https: "https://placehold.co/40x40/2196F3/FFFFFF?text=AE",
                        },
                        created_at: new Date(Date.now() - 7200000).toISOString(),
                        public_metrics: { like_count: 75, reply_count: 8, retweet_count: 15, quote_count: 2 },
                        extended_entities: null,
                    },
                    {
                        id: "1000000000000000003",
                        text: `Learning React hooks today. So powerful! Query: ${queryParam}`,
                        user: {
                            name: "ReactLearner",
                            username: "reactdev",
                            profile_image_url_https: "https://placehold.co/40x40/FFC107/FFFFFF?text=RL",
                        },
                        created_at: new Date(Date.now() - 10800000).toISOString(),
                        public_metrics: { like_count: 30, reply_count: 2, retweet_count: 5, quote_count: 0 },
                        extended_entities: null,
                    },
                     {
                        id: "1000000000000000004",
                        text: `Future of #blockchain and ${queryParam || "decentralization"}.`,
                        user: {
                            name: "BlockchainFan",
                            username: "blockchainbuzz",
                            profile_image_url_https: "https://placehold.co/40x40/9C27B0/FFFFFF?text=BF",
                        },
                        created_at: new Date(Date.now() - 12800000).toISOString(),
                        public_metrics: { like_count: 90, reply_count: 10, retweet_count: 20, quote_count: 3 },
                        extended_entities: null,
                    },
                    {
                        id: "1000000000000000005",
                        text: `Exploring new trends in ${queryParam || "digital marketing"}.`,
                        user: {
                            name: "DigitalGuru",
                            username: "digitaltrends",
                            profile_image_url_https: "https://placehold.co/40x40/FF5722/FFFFFF?text=DG",
                        },
                        created_at: new Date(Date.now() - 14800000).toISOString(),
                        public_metrics: { like_count: 45, reply_count: 4, retweet_count: 8, quote_count: 1 },
                        extended_entities: null,
                    }
                ];

                const filteredTweets = mockTweets.filter(tweet =>
                    queryParam ? tweet.text.toLowerCase().includes(queryParam.toLowerCase()) || tweet.user.username.toLowerCase().includes(queryParam.toLowerCase()) : true
                ).slice(0, maxResults);

                resolve({
                    data: {
                        data: filteredTweets,
                        includes: {
                            users: filteredTweets.map(t => t.user),
                        }
                    }
                });
            }, 700);
        });
    }
};


export default function RecentPosts() {
    const [queryInput, setQueryInput] = useState('');
    const [fetchedTweets, setFetchedTweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            const res = await axiosInstance.get(`http://localhost:4000/api/twitter/search/recent`, {
                params: {
                    query: queryInput,
                    max_results: 10,
                }
            });

            if (res.data && res.data.data) {
                const tweets = res.data.data.map(tweet => {
                    const author = res.data.includes?.users?.find(user => user.id === tweet.author_id);
                    const media = tweet.attachments?.media_keys?.map(key =>
                        res.data.includes?.media?.find(m => m.media_key === key)
                    ).filter(Boolean);

                    return {
                        id: tweet.id,
                        text: tweet.text,
                        full_text: tweet.text,
                        created_at: tweet.created_at,
                        user: {
                            id: author?.id,
                            name: author?.name,
                            screen_name: author?.username,
                            profile_image_url_https: author?.profile_image_url
                        },
                        favorite_count: tweet.public_metrics?.like_count || 0,
                        reply_count: tweet.public_metrics?.reply_count || 0,
                        retweet_count: tweet.public_metrics?.retweet_count || 0,
                        quote_count: tweet.public_metrics?.quote_count || 0,
                        extended_entities: media ? { media: media } : undefined
                    };
                });
                setFetchedTweets(tweets);
            } else {
                setFetchedTweets([]);
                setError("No recent tweets found for this query.");
            }

        } catch (err) {
            console.error('Failed to fetch recent tweets:', err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(`Error: ${err.response.data.detail}`);
            } else if (err.message) {
                setError(`Failed to fetch recent tweets: ${err.message}`);
            } else {
                setError('Failed to fetch recent tweets. Please try again.');
            }
            setFetchedTweets([]);
        } finally {
            setLoading(false);
        }
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

                {fetchedTweets.length === 0 && !loading && !error && (
                    <p className="text-zinc-400 text-center">Enter a query and click "Search Recent Tweets" to see results.</p>
                )}

                {fetchedTweets.map((tweet) => (
                    <div key={tweet.id} className="bg-zinc-700 p-5 rounded-md mb-4 shadow-inner">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-teal-500">
                                <img
                                    src={tweet.user?.profile_image_url_https || 'https://placehold.co/40x40/333/FFF?text=U'}
                                    alt="User Profile"
                                    className="w-full h-full object-cover object-center scale-125"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/333/FFF?text=U" }}
                                />
                            </div>
                            <h3 className="font-bold text-blue-200 text-xl">
                                {tweet.user?.name || 'Anonymous'}
                                {tweet.user?.screen_name && (
                                    <span className="text-zinc-400 text-sm tracking-wide mt-0.5 ml-2">@{tweet.user.screen_name}</span>
                                )}
                                <p className="text-zinc-400 text-sm tracking-wide mt-0.5">
                                    {new Date(tweet.created_at).toLocaleString()}
                                </p>
                            </h3>
                        </div>
                        <p className="text-zinc-100 text-base leading-relaxed whitespace-pre-wrap break-words mb-4">
                            {tweet.full_text || tweet.text || 'No content available.'}
                        </p>

                        {tweet.extended_entities?.media && tweet.extended_entities.media.length > 0 && (
                            <div className="media-preview my-3 p-2 border border-zinc-600 rounded relative bg-zinc-600 flex justify-center items-center flex-wrap gap-2">
                                {tweet.extended_entities.media.map((media, index) => (
                                    <div key={index} className="flex-1 min-w-[48%] max-w-full">
                                        {media.type === 'photo' && (
                                            <img
                                                src={media.url || media.media_url_https}
                                                alt="Tweet Media"
                                                className="w-full h-auto object-contain rounded-md"
                                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/555/EEE?text=Image+Load+Error" }}
                                            />
                                        )}
                                        {(media.type === 'video' || media.type === 'animated_gif') && media.video_info?.variants && (
                                            <video
                                                controls
                                                className="w-full h-auto object-contain rounded-md"
                                                poster={media.preview_image_url || media.media_url_https}
                                            >
                                                {media.video_info.variants.map((variant, i) => (
                                                    variant.content_type.startsWith('video/') && (
                                                        <source key={i} src={variant.url} type={variant.content_type} />
                                                    )
                                                ))}
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-6 mt-4 pt-3 border-t border-zinc-600">
                            <div className="flex items-center gap-1 text-teal-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5 0A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                <p>{tweet.favorite_count || 0}</p>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                                <p>{tweet.reply_count || 0}</p>
                            </div>
                            <div className="flex items-center gap-1 text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"/></svg>
                                <p>{tweet.quote_count || tweet.retweet_count || 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}