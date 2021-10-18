const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "randint",
  description: "creates a random int between 2 numbers, place a comma bewtten the numbers",
  permissions: "MANAGE_MESSAGES",
  options: [
    {
      name: "command",
      description: "Learn more about a specific command.",
      type: "STRING",
      required: false,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { options } = interaction;
    const Response = new MessageEmbed().setColor("BLURPLE");
    const Target = options.getString("command");
    if(Target.indexOf(",") != -1){
    var int1 = Target.substring(0,Target.indexOf(','));
    var int2 = Target.substring(Target.indexOf(',') + 1);
    console.log(Target + " + " + int1 + " + " +int2)
    Response.setColor("BLURPLE");
    if(int1.indexOf(".") === -1 || int2.indexOf(".") == -1){    
        Response.setDescription(
            (Math.floor((Math.random()*((int2 * 1)- (int1 * 1))) + (int1 * 1))).toString()
        );
        return interaction.reply({ embeds: [Response]});
    }else{
      return "you can only use whole numbers"
    }

    }else{
      return "you have to have 2 numbers seperated my a comma"
    }
  }
}