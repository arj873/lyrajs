const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
require("../../events/client/ready");

module.exports = {
  name: "status",
  description: "Displays the status of the bot.",
  permissions: "SEND_MESSAGES",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const Response = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription(
        `**Latency**: ${client.ws.ping} ms. **Uptime**: <t:${parseInt(
          client.readyTimestamp / 1000
        )}:R> **Database**: ${switchTo(connection.readyState)}`
      );

    interaction.reply({ embeds: [Response] });
  },
};

function switchTo(val) {
  var status = " ";
  switch (val) {
    case 0:
      status = "Disconnected";
      break;
    case 1:
      status = "Connected";
      break;
    case 2:
      status = "Connecting";
      break;
    case 3:
      status = "Disconnecting";
      break;
  }
  return status;
}
