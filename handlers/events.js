const { Events } = require("../validation/eventNames");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = async (client) => {
  (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
    const event = require(file);

    if (!Events.includes(event.name) || !event.name) {
      console.log(
        `[EVENT]${event.name} - Event name is either invalid or missing.`
      );
      return;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    await console.log(`[EVENT][${event.name}] - Successfully Loaded`);
  });
};
