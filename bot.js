// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageMentions, userMention } = require('discord.js');

const config = require('dotenv').config()

const client = new Client({ intents: [GatewayIntentBits.Guilds | GatewayIntentBits.DirectMessages | GatewayIntentBits.MessageCreate |  GatewayIntentBits.MessageUpdate | GatewayIntentBits.GuildMessageReactions | GatewayIntentBits.GuildMessageReactions |GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent ] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log(`Registering ${file}`);
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

console.log("Message registration complete");

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	client.channels.cache.get("extrabottestingprivate");
});

client.on(Events.Error, e => {
	console.log(`Error: ${e}`);
});

client.on(Events.Warn, w => {
	console.log(`Warn: ${w}`);
});

client.on(Events.Debug, m => {
	console.log(`Message: ${m}`);
});

// You need this to handle incoming command requests. This is based on Discord's own documentation.
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.MessageUpdate, async interaction => {
	console.log("---update----");
	console.log(interaction);
	console.log(interaction.content);
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Log in to Discord with your client's token
client.login(process.env.BOT_TOKEN);
