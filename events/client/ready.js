const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { Database } = require("../../data/config.json");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    console.log("The client is ready");
    client.user.setActivity("SNAKE PLUS", { type: "WATCHING" });

    if (!Database) return;
    mongoose
      .connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("The client is now connected to the database");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
