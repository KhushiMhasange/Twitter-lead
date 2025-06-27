"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const leads_1 = require("./leads");
const recentTweets_1 = require("./recentTweets");
const alchemystClient_1 = require("./alchemystClient");
const analytics_1 = __importDefault(require("./analytics"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = 4000;
app.use(analytics_1.default);
app.get('/capture-leads', async (req, res) => {
    const tweetId = req.query.tweetId;
    if (!tweetId)
        return res.status(400).send("Missing tweetId");
    try {
        const leads = await (0, leads_1.fetchLeadsFromTweet)(tweetId);
        await (0, alchemystClient_1.sendLeadsToContextProcessor)(leads);
        res.send(leads);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/twitter/search/recent', async (req, res) => {
    const queryParam = req.query.query;
    if (!queryParam) {
        return res.status(400).json({ error: 'Query is required' });
    }
    const username = 'KhushiMhasange';
    const query = `${queryParam} from:${username}`;
    try {
        const { tweets, users } = await (0, recentTweets_1.fetchRecentTweets)(query);
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
    }
    catch (err) {
        console.error('Failed to fetch tweets:', err);
        res.status(500).json({ error: 'Error fetching tweets' });
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
