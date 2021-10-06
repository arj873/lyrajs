const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description:
    "Deletes a specified amount of messages from a channel or a user.",
  permission: "MANAGE_MESSAGES",
  options: [
    {
      name: "amount",
      description: "Select the amount of messages from a channel or a user.",
      type: "NUMBER",
      required: true,
    },
    {
      name: "target",
      description: "Select a member to clear messages.",
      type: "USER",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { channel, options } = interaction;

    const Amount = options.getNumber("amount");
    const Target = options.getMember("target");

    const Messages = await channel.messages.fetch();

    const Response = new MessageEmbed().setColor("BLURPLE");

    if (Amount > 100 || Amount <= 0) {
      Response.setColor("RED");
      Response.setDescription(
        `Amount cannot exceed 100, and cannot be under 1.`
      );
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (Target) {
      let i = 0;
      const filtered = [];
      (await Messages).filter((m) => {
        if (m.author.id === Target.id && Amount > i) {
          filtered.push(m);
          i++;
        }
      });

      await channel.bulkDelete(filtered, true).then((messages) => {
        if (messages.size > 1) {
          Response.setDescription(
            `**${messages.size} messages** have been cleared from ${Target}.`
          );
          interaction.reply({ embeds: [Response] });
        } else {
          Response.setDescription(
            `**${messages.size} message** have been cleared from ${Target}.`
          );
          interaction.reply({ embeds: [Response] });
        }
      });
    } else {
      await channel.bulkDelete(Amount, true).then((messages) => {
        if (messages.size > 1) {
          Response.setDescription(
            `**${messages.size} messages** have been cleared from this channel.`
          );
          interaction.reply({ embeds: [Response] });
        } else {
          Response.setDescription(
            `**${messages.size} message** have been cleared from this channel.`
          );
          interaction.reply({ embeds: [Response] });
        }
      });
    }
  },
};
