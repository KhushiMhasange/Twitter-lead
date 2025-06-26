"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTweetId = fetchTweetId;
exports.fetchLeadsFromTweet = fetchLeadsFromTweet;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const oauth = new oauth_1_0a_1.default({
    consumer: {
        key: process.env.API_KEY || '',
        secret: process.env.API_SECRET_KEY || '',
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto_1.default
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64');
    },
});
const token = {
    key: process.env.ACCESS_TOKEN || '',
    secret: process.env.ACCESS_TOKEN_SECRET || '',
};
async function fetchTweetId() {
    const url = 'https://api.twitter.com/2/tweets/search/recent';
    try {
        const res = await axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
                Accept: 'application/json',
            },
            params: {
                query: 'webdev OR programming',
                max_results: 5,
            },
        });
        const tweets = res.data.data.map((tweet) => ({
            id: tweet.id,
            text: tweet.text,
        }));
        console.log(tweets);
    }
    catch (err) {
        console.error('Error retrieving tweets:', err.response?.data || err.message);
    }
}
async function fetchLeadsFromTweet(tweetId, limit = 20) {
    const params = new URLSearchParams({
        max_results: limit.toString(),
    }).toString();
    const url = `https://api.twitter.com/2/tweets/${tweetId}/liking_users?${params}`;
    const requestData = {
        url,
        method: 'GET',
    };
    try {
        const res = await axios_1.default.get(url, {
            headers: {
                ...oauth.toHeader(oauth.authorize(requestData, token)),
            },
        });
        const leads = res.data.data.map((user) => ({
            content: `${user.name} with username : ${user.username} liked the post related to Dev`,
            filename: 'likes',
            fileType: 'string',
            fileSize: 120,
            lastModified: 'June 24, 2025',
        }));
        const lead = {
            user_id: 'KhushiMhasange',
            organization_id: 'Personal',
            documents: leads,
            source: 'x.com',
            context_type: 'resource',
            scope: 'internal',
            metadata: {
                fileName: 'leads from twitter on post about AI agents',
                fileType: 'string',
                fileSize: 1024,
                lastModified: 'June 24, 2025',
            },
        };
        return lead;
    }
    catch (err) {
        console.error('Error fetching leads:', err.response?.data || err.message);
        return [];
    }
}
