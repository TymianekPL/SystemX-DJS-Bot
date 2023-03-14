const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const BaseSlashCommand = require('../../utils/BaseSlashCommand')
const RegisterModel = require('../../data/configAuthDatabase')
const { registerCommands } = require('../../utils/registry')

module.exports = class RegisterSlashCommand extends BaseSlashCommand {
     constructor() {
          super('register')
     }
     async run(client, interaction) {
          const checkUser = await RegisterModel.findOne({ username: interaction.options.get('username').value })
          let alreadyRegistred_message = new EmbedBuilder()
               .setTitle('Failed Registering...')
               .setDescription(`This username has already registered, ${checkUser?.username} !`)
               .setColor('Red')
               .setTimestamp()
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
          const successLogged_message = new EmbedBuilder()
               .setTitle('Successfully Registred!')
               .setDescription(`${interaction.user.username} you have been registered Successfully!`)
               .setColor('Green')
               .setTimestamp()
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
          const notMatchPassword_message = new EmbedBuilder()
               .setTitle('Passwords do not match!')
               .setDescription("Password doesn't match, Please confirm your password!")
               .setColor('Yellow')
               .setTimestamp()
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
          const checkIdUser = await RegisterModel.findOne({
               user_id: interaction.user.id
          })
          const AlreadyUserRegistred_message = new EmbedBuilder()
               .setTitle('Already registred!')
               .setDescription(`Your account have already registered.`)
               .setTimestamp()
               .setColor('Orange')
               .setTimestamp()
               .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
          if (checkUser?.username === interaction.options.get('username').value ) {
               return interaction.reply({ embeds: [alreadyRegistred_message],ephemeral: true })
          }

          if (checkIdUser?.user_id === interaction.user.id) {
               return interaction.reply({ embeds: [AlreadyUserRegistred_message],ephemeral: true })
          }
          if (interaction.options.get('password').value !== interaction.options.get('confirm').value) {
               return interaction.reply({ embeds: [notMatchPassword_message],ephemeral: true })
          }
          try {
               const newUser = new RegisterModel({
                    username: interaction.options.get('username').value,
                    password: interaction.options.get('password').value,
                    isLogged: false,
                    user_id: interaction.user.id
               })
               newUser.save()
               return interaction.reply({ embeds: [successLogged_message],ephemeral: true })
          } catch (err) {
               console.log(err)
          }

     }
     getSlashCommandJSON() {
          return new SlashCommandBuilder()
               .setName(this.name)
               .setDescription('Register with SystemX bot')
               .addStringOption(option =>
                    option.setName('username')
                         .setDescription('Create your username')
                         .setRequired(true)
               )
               .addStringOption(option =>
                    option.setName('password')
                         .setDescription('Create your password')
                         .setRequired(true)
               )
               .addStringOption(option =>
                    option.setName('confirm')
                         .setDescription('Confirm your password')
                         .setRequired(true)
               )
     }
}