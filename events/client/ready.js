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
    console.log("[CLIENT] - ready");
    client.user.setActivity("SNAKE PLUS", { type: "WATCHING" });

    if (!Database) return;
    mongoose
      .connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("[CLIENT] - Connected to the Database");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
