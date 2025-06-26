"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const leads_1 = require("./leads");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = 4000;
app.get('/capture-leads', async (req, res) => {
    const tweetId = req.query.tweetId;
    if (!tweetId)
        return res.status(400).send("Missing tweetId");
    try {
        const leads = await (0, leads_1.fetchLeadsFromTweet)(tweetId);
        // await sendLeadsToContextProcessor(leads);
        console.log(leads);
        res.send(leads);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
