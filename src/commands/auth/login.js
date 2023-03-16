const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const BaseSlashCommand = require("../../utils/BaseSlashCommand");
const RegisterModel = require("../../data/configAuthDatabase");

module.exports = class LoginSlashCommand extends BaseSlashCommand {
     constructor() {
          super("login");
     }
     async run(client, interaction) {
          const LoginUser = await RegisterModel.findOne({ user_id: interaction.user.id });
          let alreadyLogged_message = new EmbedBuilder()
               .setTitle("Already Logged in!")
               .setDescription("Your account is already logged, try `/logout`!")
               .setColor("Purple")
               .setTimestamp()
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });
          let success_login = new EmbedBuilder()
               .setTitle("Successfully Logged in!")
               .setDescription("You have been Logged in, " + LoginUser?.username)
               .setTimestamp()
               .setColor("Green")
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });
          let notFound_message = new EmbedBuilder()
               .setTitle("Password or Username doesn't match!")
               .setDescription("Invalid Password & Username, Please check you informations!?")
               .setColor("Red")
               .setTimestamp()
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() });
          try {
               if (LoginUser?.username !== interaction.options.get("username").value || LoginUser?.password !== interaction.options.get("password").value) {
                    return interaction.reply({ embeds: [notFound_message], ephemeral: true });
               }
               if (LoginUser?.username == interaction.options.get("username").value && LoginUser?.password == interaction.options.get("password").value) {
                    if (LoginUser?.isLogged) {
                         return interaction.reply({ embeds: [alreadyLogged_message], ephemeral: true });
                    } else {
                         const changeLogginBoolean = await RegisterModel.findOneAndUpdate({ user_id: interaction.user.id }, { isLogged: true });
                         changeLogginBoolean.save();
                         return interaction.reply({ embeds: [success_login], ephemeral: true });
                    }
               }
          } catch (err) {
               console.log(err);
          }

     }
     getSlashCommandJSON() {
          return new SlashCommandBuilder()
               .setName(this.name)
               .setDescription("Login with SystemX bot")
               .addStringOption(option =>
                    option.setName("username")
                         .setDescription("Enter your account username")
                         .setRequired(true)
               )
               .addStringOption(option =>
                    option.setName("password")
                         .setDescription("Enter your account password")
                         .setRequired(true)
               );
     }
};