const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const BaseSlashCommand = require("../utils/BaseSlashCommand");

module.exports = class PingSlashCommand extends BaseSlashCommand {
     constructor() {
          super("ping");
     }
     async run(client, interaction) {
          try {
               const mesg = await interaction.reply({
                    content: "Pinging...",
                    fetchReply: true
               });
               let ping_message = new EmbedBuilder()
                    .setTitle("Bot Ping:")
                    .setDescription(
                         `Bot Latency: \`${
                              mesg.createdTimestamp -
                              interaction.createdTimestamp
                         }ms\`, Websocket Latency: \`${client.ws.ping}ms\``
                    )
                    .setColor("Blue");
               await interaction.editReply({ embeds: [ping_message] });
          } catch (err) {
               console.log(err);
          }
     }
     getSlashCommandJSON() {
          return new SlashCommandBuilder()
               .setName("ping")
               .setDescription("Get Ping of Bot");
     }
};
