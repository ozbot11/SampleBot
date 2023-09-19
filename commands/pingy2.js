const { SlashCommandBuilder } = require('discord.js');

var optionsList =
[
"Hi",
"Hello",
"How are you",
"My name is bot"
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingy2')
		.setDescription('Replies with Pongy!'),
	async execute(interaction) {
                console.log(Math.floor(Math.random() * optionsList.length));
                var randomOption = optionsList[(Math.floor(Math.random() * optionsList.length))%4];
                await interaction.reply('' + randomOption);
	},
};