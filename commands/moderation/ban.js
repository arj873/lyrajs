const { CommandInteraction, MessageEmbed } = require("discord.js");
const db = require("../../models/infractions");

module.exports = {
  name: "ban",
  description: "Bans the selected user.",
  permission: "BAN_MEMBERS",
  options: [
    {
      name: "member",
      description: "Select a member to ban.",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the ban.",
      type: "STRING",
      required: false,
    },
    {
      name: "messages",
      description: "Number of days to delete message history from (0 - 7)",
      type: "NUMBER",
      required: false,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  execute(interaction, client) {
    const { guild, member } = interaction;

    const Target = interaction.options.getMember("member");
    const Reason = interaction.options.getString("reason");
    const Amount = interaction.options.getNumber("messages");

    const Response = new MessageEmbed().setColor("RED");

    if (Target.id === member.id) {
      Response.setDescription("You cannot ban yourself.");
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (Target.roles.highest.position > member.roles.highest.position) {
      Response.setDescription("You cannot ban a member with a higher role.");
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (Target.permissions.has(this.permission)) {
      Response.setDescription("You cannot ban a member with ban permissions.");
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    if (Amount > 7) {
      Response.setDescription("The number provided cannot not exceed 7.");
      return interaction.reply({ embeds: [Response], ephemeral: true });
    }

    Target.send({
      embeds: [
        new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(
            `You have been banned by ${member.user.tag}. Reason: ${Reason}.`
          ),
      ],
    }).catch(() => {
      Response.setDescription(
        `A ban notice could not be sent to ${Target.user.tag}.`
      );
    });

    if (Reason === null) {
      Response.setDescription(
        `${Target} has been banned by ${member.user.tag}. No reason provided.`
      );
      interaction.reply({ embeds: [Response] });
    } else {
      Response.setDescription(
        `${Target} has been banned by ${member.user.tag}. Reason: ${Reason}.`
      );
      interaction.reply({ embeds: [Response] });
    }

    db.findOne(
      { GuildID: guild.id.split, UserID: Target.id },
      async (err, data) => {
        if (err) throw err;
        if (!data || !data.BanData) {
          data = new db({
            GuildID: guild.id,
            UserID: Target.id,
            BanData: [
              {
                ExecuterID: member.id,
                ExecuterTag: member.user.tag,
                TargetID: Target.id,
                targetTag: Target.user.tag,
                Messages: Amount,
                Reason: Reason,
                Date: parseInt(interaction.createdTimestamp / 1000),
              },
            ],
          });
        } else {
          const BanDataObject = {
            ExecuterID: member.id,
            ExecuterTag: member.user.tag,
            TargetID: Target.id,
            targetTag: Target.user.tag,
            Messages: Amount,
            Reason: Reason,
            Date: parseInt(interaction.createdTimestamp / 1000),
          };
          data.BanData.push(BanDataObject);
        }
        data.save();
      }
    );

    Target.ban({ days: Amount, reason: Reason }).catch((err) => {
      console.log(err);
    });
  },
};
