const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const {uri} = require("../config.json");

const client = new MongoClient(uri);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registermatch')
    .setDescription('Register a match to the database')
    .addRoleOption(option =>
      option.setName("team1")
        .setDescription("Team 1")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("team2")
        .setDescription("Team 2")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("team1score")
        .setDescription("Team 1 score")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("team2score")
        .setDescription("Team 2 score")
        .setRequired(true)),
      
  async execute(interaction) {
    const options = interaction.options;

    const team1score = interaction.options.getInteger('team1score');
    const team2score = interaction.options.getInteger('team2score');
    try {
      await client.connect();
      console.log('Connected to MongoDB cluster successfully!');

      const dbo = client.db("ValorantTournament").collection("Matches");

      const newMatch = {
        team1: options.getRole("team1").name,
        team2: options.getRole("team2").name,
        team1score: team1score,
        team2score: team2score,
      };

      const result = await dbo.insertOne(newMatch);
      console.log(`Document inserted with _id: ${result.insertedId}`);
    } catch (error) {
      console.error('Error inserting document:', error);
    } finally {
      client.close();
    }

    await interaction.reply('Match successfully registered');
  },
};
