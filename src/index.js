const { Client, Collection ,GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js')
const client = new Client({
     intents: [
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.Guilds,
     ]
})
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const set = require("./data/config.json")
require('dotenv').config();
const {registerCommands, registerSubcommands} = require('./utils/registry')
client.on('ready', () => {
     console.log(`${client.user.username} is Ready!`)
     client.user.setPresence({ activities: [{ name: `Future...`, type: ActivityType.Listening }], status: "online" })
})
const TOKEN = process.env.TOKEN
const rest = new REST({ version: '10' }).setToken(TOKEN)

client.on('guildMemberAdd', (member) => {
     const role = member.guild.roles.cache.find(role => role.name === "Member")
     member.roles.add(role)
     const welcome_message = new EmbedBuilder()
          .setDescription(`Welcome to ${member.guild.name} Server! Don't forget to read the <#1084194422436151529> :wave:`)
          .setAuthor({ name: `${member.user.tag} just joined!`, iconURL: member.user.avatarURL() })
          .setColor("Blue");
     client.channels.cache.get('1084194422436151529')?.send({ embeds: [welcome_message] })
})

async function main() {
     client.slashCommands = new Collection();
       client.slashSubcommands = new Collection();
       await registerCommands(client, '../commands');
       await registerSubcommands(client);
       const slashCommandsJson = client.slashCommands.map((cmd) =>
         cmd.getSlashCommandJSON()
       );
       const slashSubcommandsJson = client.slashSubcommands.map((cmd) =>
         cmd.getSlashCommandJSON()
       );
     try {
       await rest.put(Routes.applicationGuildCommands(set.CLIENT_ID, set.GUILD_ID), {
         body: [...slashCommandsJson, ...slashSubcommandsJson],
       });
       const registeredSlashCommands = await rest.get(
         Routes.applicationGuildCommands(set.CLIENT_ID, set.GUILD_ID)
       );
       console.log(registeredSlashCommands);
      
     } catch (err) {
       console.log(err);
     }
   }
   
   main();

client.on('interactionCreate', (interaction) => {
     if (interaction.isChatInputCommand()) {
          const { commandName } = interaction;
          const cmd = client.slashCommands.get(commandName);
          const subcommandGroup = interaction.options.getSubcommandGroup(false);
          const subcommandName = interaction.options.getSubcommand(false);
          console.log(commandName);
          console.log(subcommandGroup, subcommandName);
          if (subcommandName) {
               if (subcommandGroup) {
                    const subcommandInstance = client.slashSubcommands.get(commandName);
                    subcommandInstance.groupCommands
                         .get(subcommandGroup)
                         .get(subcommandName)
                         .run(client, interaction);
               } else {
                    const subcommandInstance = client.slashSubcommands.get(commandName);
                    subcommandInstance.groupCommands
                         .get(subcommandName)
                         .run(client, interaction);
               }
               return;
          }
          if (cmd) {
               cmd.run(client, interaction);
          } else {
               interaction.reply({ content: 'This command has no run method.' });
          }
     }
})
client.login(process.env.TOKEN);