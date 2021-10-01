const { Client, Message } = require("discord.js");
const { player } = require(".");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */
module.exports = async (client, message, cmd, args) => {
  if (cmd === "ping") {
    message.reply(`Ping :- ${client.ws.ping}`);
  } else if (cmd === "play") {
    let voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply(`Тебе нужно зайти в голосовой канал`);

    let search_Song = args.join(" ");
    if (!search_Song) return message.reply(`Напиши имя песни или вставь ссылку`);

    let queue = player.createQueue(message.guild.id, {
      metadata: {
        channel: message.channel,
      },
    });

    // verify vc connection
    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch {
      queue.destroy();
      return await message.reply({
        content: "Could not join your voice channel!",
        ephemeral: true,
      });
    }

    let song = await player
      .search(search_Song, {
        requestedBy: message.author,
      })
      .then((x) => x.tracks[0]);

    if (!song) return message.reply(` Я не смог найти\`${search_Song}\` `);

    queue.play(song);

    message.channel.send({ content: `⏱️ | Загрузка трека **${song.title}**!` });
  } else if (cmd === "skip") {
    let queue = player.getQueue(message.guild.id);
    queue.skip();
    message.channel.send(`Песня пропущена`);
  } else if (cmd === "stop") {
    let queue = player.getQueue(message.guild.id);
    queue.stop();
    message.channel.send(`Песня остановлена`);
  } else if (cmd === "loop") {
    let queue = player.getQueue(message.guild.id);
    queue.setRepeatMode(queue);
    message.channel.send(`Песня поставлена на репит`);
  } else if (cmd === "pause") {
    let queue = player.getQueue(message.guild.id);
    queue.setPaused(true);
    message.channel.send(`Песня поставлена на паузу`);
  } else if (cmd === "resume") {
    let queue = player.getQueue(message.guild.id);
    queue.setPaused(false);
    message.channel.send(`Песня возобновлена`);
  } else if (cmd === "volume") {
    let queue = player.getQueue(message.guild.id);
    let amount = parseInt(args[0]);
    queue.setVolume(amount);
    message.channel.send(`Громкость изменена на \`${amount}\``);
  }
};
