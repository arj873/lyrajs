console.clear();

const { Client, Collection } = require("discord.js");
const { Token } = require("./data/config.json");

const client = new Client({ intents: 32767 });

client.commands = new Collection();

require("./handlers/events")(client);
require("./handlers/commands")(client);

client
  .login(Token)
  .then(() => {
    console.log("[CLIENT] - Logged in as " + "[" + client.user.tag + "]");
  })
  .catch((err) => {
    console.log(err);
  });
