Tweet-to-AI Lead Generator
This project helps you find people who are interested in specific topics on Twitter and sends their information to a smart AI system for analysis.

Imagine you have a tweet about a new product or idea. People who "like" that tweet are likely interested in what you're offering. This tool automatically finds those people and forwards their details to an AI that can help you understand them better.

✨ How It Works
You Pick a Tweet: You tell the tool which tweet you're curious about (by its unique ID number).
It Asks Twitter: The tool then securely talks to Twitter and asks, "Who liked this tweet?" (You can even tell it how many likers you want to see, like the top 10 or 20).
Gathers Basic Info: Twitter sends back a list of people who liked the tweet, including their names and Twitter usernames.
Creates "Lead Packages": For each person, the tool creates a special "package" of information. This package includes:
Who they are (their user ID).
What they did (e.g., "Liked an AI post").
Where this information came from (Twitter).
Other useful details for the AI.
Sends to AI: Finally, each "lead package" is sent individually to a powerful AI system (called the "Context Processor"). This AI can then store and use this information to help you manage your leads.

🚀 Getting Started
To use this, you'll need:

Twitter Developer Account & Keys: Special secret keys from Twitter that let your tool talk to their system.
Alchemyst-ai API Key: Another key to connect to the AI system.
A .env File: A secret file on your computer to safely store all these keys.
The Code: JavaScript code using libraries like axios (for sending/receiving data) and oauth-1.0a (for Twitter's secure handshake).
Once set up, you just tell the main script a tweet ID, and it does the rest!

⚠️ Important
Keep Keys Secret: Never share your API keys or .env file!
Twitter Limits: Twitter has rules about how often you can ask for information. Don't ask too many times too quickly!