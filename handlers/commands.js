const { Perms } = require("../validation/permissions");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  CommandsArray = [];

  (await PG(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
    const command = require(file);

    if (!command.name)
      return console.log(`[${file}] - Missing a Name`)

    if (command.type !== "USER" && !command.description) 
      return console.log(`[${command.name}]` - "Missing Description");

    if (command.permission) {
      if (Perms.includes(command.permission)) command.defaultPermission = false;
      else return console.log(`[COMMAND][${command.name}] - Permission Invalid`)
    }

    client.commands.set(command.name, command);
    CommandsArray.push(command);
    
    await console.log(`[COMMAND][${command.name}] - Successfully Loaded.`)
  });

  // Permissions
  client.on("ready", async () => {
    const MainGuild = await client.guilds.cache.get("867486888557150219");

    MainGuild.commands.set(CommandsArray).then(async (command) => {
      const Roles = (commandName) => {
        const cmdPerms = CommandsArray.find(
          (c) => c.name === commandName
        ).permission;
        if (!cmdPerms) return null;

        return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
      };

      const fullPermissions = command.reduce((accumulator, r) => {
        const roles = Roles(r.name);
        if (!roles) return accumulator;

        const permissions = roles.reduce((a, r) => {
          return [...a, { id: r.id, type: "ROLE", permission: true }];
        }, []);
        return [...accumulator, { id: r.id, permissions }];
      }, []);

      await MainGuild.commands.permissions.set({ fullPermissions });
    });
  });
};
