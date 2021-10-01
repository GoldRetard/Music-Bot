const { Client, Message } = require("discord.js");
const { player } = require(".");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client) => {
    console.log(`Events Loaded`);
  // track start
  player.on("trackStart", async (queue, track) => {
    queue.metadata.channel.send(`🎵 Играет \`${track.title}\``);
  });

  // song added
  player.on("trackAdd", async (queue, track) => {
    queue.metadata.channel.send(`🎵 Добавлено в очередь \`${track.title}\``);
  });
};
