const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rares')
		.setDescription('Rares!'),
	async execute(interaction) {
		await interaction.reply('Rares!');
	},
};