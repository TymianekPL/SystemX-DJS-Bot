const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const BaseSlashCommand = require("../../utils/BaseSlashCommand");
const RegisterModel = require("../../data/configAuthDatabase");

module.exports = class LogoutSlashCommand extends BaseSlashCommand {
     constructor() {
          super("logout");
     }
     async run(client, interaction) {
          const getUser = await RegisterModel.findOne({
               user_id: interaction.user.id
          });
          let success_message = new EmbedBuilder()
               .setTitle("Successfully Logout!")
               .setDescription("You have been successfully logout!")
               .setColor("Green")
               .setTimestamp()
               .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
               });
          let alreadyLoggedOut_message = new EmbedBuilder()
               .setTitle("Failed Logging Out...")
               .setDescription("You have Already logged out? try `/login` !")
               .setColor("Yellow")
               .setTimestamp()
               .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
               });
          try {
               if (getUser?.isLogged) {
                    const LogoutUser = await RegisterModel.findOneAndUpdate(
                         { user_id: interaction.user.id },
                         { isLogged: false }
                    );
                    LogoutUser.save();
                    return interaction.reply({
                         embeds: [success_message],
                         ephemeral: true
                    });
               } else {
                    return interaction.reply({
                         embeds: [alreadyLoggedOut_message],
                         ephemeral: true
                    });
               }
          } catch (err) {
               console.log(err);
          }
     }
     getSlashCommandJSON() {
          return new SlashCommandBuilder()
               .setName("logout")
               .setDescription("Logout from your account");
     }
};
