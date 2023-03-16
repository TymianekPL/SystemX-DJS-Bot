const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const BaseSlashCommand = require("../utils/BaseSlashCommand.js");
const helpList = require("../data/helpList");

module.exports = class helpSlashCommand extends BaseSlashCommand {
     constructor() {
          super("help");
     }

     run(client, interaction) {
          let helpMessageEmbed = new EmbedBuilder()
               .setTitle(client.user.username + "'s Command List")
               .setAuthor({
                    name: `${interaction.guild.name}`,
                    iconURL: interaction.guild.iconURL()
               })
               .setThumbnail(client.user.avatarURL({ dynamic: true }))
               .setDescription("You can learn more: **/help (command name)**")
               .addFields(
                    {
                         name: "/project :bar_chart:",
                         value: "introduce your project",
                         inline: true
                    },
                    {
                         name: "/code :computer:",
                         value: "coding features",
                         inline: true
                    },
                    {
                         name: "/team :busts_in_silhouette:",
                         value: "setup a team",
                         inline: true
                    }
               )
               .addFields(
                    {
                         name: "/create :envelope_with_arrow:",
                         value: "create a project",
                         inline: true
                    },
                    {
                         name: "/system :gear:",
                         value: "system Commands",
                         inline: true
                    },
                    {
                         name: "/build :hammer:",
                         value: "create a message",
                         inline: true
                    }
               )
               .setTimestamp()
               .setFooter({
                    text: `requested by ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
               });
          interaction.user.send({ embeds: [helpMessageEmbed] });
          return interaction.reply({
               content: `<@${interaction.user.id}>, Look at your DMs for the help Command List!`
          });
     }
     getSlashCommandJSON() {
          return new SlashCommandBuilder()
               .setName(this.name)
               .setDescription("SystemX Command List")
               .addStringOption((option) =>
                    option
                         .setName("command")
                         .setDescription("add a specefic command")
                         .addChoices(...helpList)
               )
               .setDMPermission(false);
     }
};
