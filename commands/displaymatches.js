const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const {uri} = require("../config.json");

const testEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Matches')
	.setDescription('All of the matches');

const client = new MongoClient(uri);

var allMatches;

async function loadMatches() {
  try {
    await client.connect();
    console.log('Connected to MongoDB cluster successfully!');

    const database = client.db("ValorantTournament");
    const matchesCollection = database.collection("Matches");

    // Fetch all documents from the "Matches" collection
    allMatches = await matchesCollection.find({}).toArray();

  } catch (error) {
    console.error('Error loading matches:', error);
  } finally {
    client.close();
    return allMatches;
  }
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('displaymatches')
		.setDescription('Display all the matches'),
	async execute(interaction) {
        allMatches = [];
        const matches = await loadMatches();
        //Loading the matches from the database
        var tempEmbed = testEmbed;
        matches.forEach((match, index) => {
            const matchName = `${match.team1}-${match.team2}`;
            const matchScore = `${match.team1score}-${match.team2score}`;
            tempEmbed.addFields({ name: `${index + 1}: `+matchName, value: matchScore });
        });
		//await interaction.channel.send({embeds: [tempEmbed]});
        await interaction.reply({embeds: [tempEmbed]});
	},
};