const { REST } = require("@discordjs/rest");
require('dotenv').config();
const {OpenAI} = require('openai');
const { Client, GatewayIntentBits, Collection } = require("discord.js");


const client = new Client({ intents: 3276799 });

const openai = new OpenAI({
  apiKey:process.env.OPENAI_KEY,
})

client.on('ready', () => {
  console.log('Je suis ready')
})

client.on("messageCreate", async (message) => {
  if (message.content === "salut") {
    message.react("👋").then(console.log).catch(console.error);
  } else {
    if (message.content === "Salut") {
      message.react("👋").then(console.log).catch(console.error);
    } else {
      if (message.content === "Bonjour") {
        message.react("👋").then(console.log).catch(console.error);
      } else {
        if (message.content === "bonjour") {
          message.react("👋").then(console.log).catch(console.error);
        }
      }
    }
  }
});

client.on('messageCreate', async(message) => {
  if(message.author.bot || message.channel.id !== process.env.channel_id || message.content.startsWith('!')){
    return; 
  }
  let conversations = [{role: 'user', content:'Je suis un bot' }];

  try  {
    await message.channel.sendTyping();
    const prevMessage = await message.channel.messages.fetch({limit: 15});
    prevMessage.reverse().forEach((message) =>{
      if (message.content.startsWith('!') || (message.author.bot && message.author.id !== client.user.id)){
        return;
      }
      const role = message.author.id === client.user.id ? 'assistant' : 'user'
      const name = message.author.username.replace(/_s+\g.'_'/g, '').replace(/[\w\s]/gi, ' ');

      conversations.push({ role: role, content: message.content, name: name });
    });
    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversations.map(conversation => ({ role: conversation.role, 
        content: conversation.content })),
    });
    if (completions.choices.length > 0 && completions.choices[0].message) {
      await message.reply(completions.choices[0].message);
    }
  } catch(error){
    console.error(`Une erreur s'est produite ${error.message}`)
  }
})


client.login(process.env.token);