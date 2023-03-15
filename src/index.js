const { Client, Collection, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js')
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
const { registerCommands, registerSubcommands } = require('./utils/registry')
const express = require('express')
const app = express()
app.listen(process.env.PORT, () => { console.log('Server Listening on ' + process.env.PORT + "...") })
client.on('ready', () => {
     console.log(`${client.user.username} is Ready!`)
     client.user.setPresence({ activities: [{ name: `Coding`, type: ActivityType.Playing }], status: "idle" })
})
const TOKEN = process.env.TOKEN
const rest = new REST({ version: '10' }).setToken(TOKEN)
const mongoose = require('mongoose')
const MONGO_CONNECT_SECRET = process.env.MONGO_SECRET
mongoose.connect(MONGO_CONNECT_SECRET)
client.on('guildMemberAdd', (member) => {
     const welcome_message = new EmbedBuilder()
          .setDescription(`Welcome to ${member.guild.name}! Don't forget to read the <#1083516861506928690> :wave:`)
          .setAuthor({ name: `${member.user.tag} just joined!`, iconURL: member.user.avatarURL() })
          .setColor("Blue");
     client.channels.cache.get('1082029751385981031')?.send({ embeds: [welcome_message] })
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
//api returns user information (need only to put user id in the params)
app.get('/api/user/:id', async (req, res) => {
     const guild = client.guilds.cache.first();
     const members = await guild.members.fetch();
     res.redirect(guild.members.cache.get(req.params.id).user)
})
const router = express.Router();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
const cors = require('cors');

app.use(cors({
     origin: "*",
     methods: "GET POST",
}))
const loginAuth = require('./data/configAuthDatabase');

//Handling Payload from React.js App
app.post('/api/login', async (req, res) => {
     const data = JSON.parse(req.body)
     const findUser = await loginAuth.findOne({username: data.username})
     if (findUser?.username === data.username & findUser?.password === data.password) {
          return res.status(200).send(findUser.user_id)
     } 
     if (findUser?.username !== data.username || findUser?.password !== data.password) {
          return res.sendStatus(401)
     }
     console.log(data.username)
})

client.login(process.env.TOKEN);