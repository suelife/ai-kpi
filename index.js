const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');

// This bot's main dialog.
const { AI_KPIBot } = require('./bots/bot');

// Read botFilePath and botFileSecret from .env file
// Note: Ensure you have a .env file and include botFilePath and botFileSecret.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log(`\nurl: http://localhost:3978/api/messages`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about .bot file its use and bot configuration.
const adapter = new BotFrameworkAdapter({
    // appId: endpointConfig.appId || process.env.microsoftAppID,
    // appPassword: endpointConfig.appPassword || process.env.microsoftAppPassword
    appId: process.env.microsoftAppID,
    appPassword: process.env.microsoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
    await context.sendActivity(`${ error }`);
};

// Create the Storage.
let conversationState, userState
const memoryStorage = new MemoryStorage()
conversationState = new ConversationState(memoryStorage)
userState = new UserState(memoryStorage)

// Create the main dialog.
const ai_kpiBot = new AI_KPIBot(conversationState, userState);

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        console.log("=======================================")
        console.log("index run start")
        await ai_kpiBot.run(context);
        console.log("index run end")
        console.log("=======================================")
    });
});
