const { Client, Intents } = require("discord.js");
const { Player } = require("discord-player");

const client = new Client({
  restTimeOffset: 0,
  shards: "auto",
  intents: 641,
});
const { token, prefix } = require("./config.json");

const player = new Player(client, {
  leaveOnEnd: true,
  leaveOnStop: true,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 5000,
  autoSelfDeaf: true,
  initialVolume: 50,
  bufferingTimeout: 3000,
});
module.exports = { player, client };
client.on("ready", () => {
  console.log(`Your Music is Playing`);
  client.user.setActivity("Your Song", { type: "PLAYING" });
});
require('./events')(client)
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift()?.toLowerCase();

  require("./commands")(client, message, cmd, args);
});
client.login(token);
