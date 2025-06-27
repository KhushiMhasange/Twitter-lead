"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRecentTweets = fetchRecentTweets;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || '';
async function fetchRecentTweets(query, maxResults = 10) {
    const url = 'https://api.twitter.com/2/tweets/search/recent';
    const response = await axios_1.default.get(url, {
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
