const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://definitmoment:KarjL11f4cr8rq0U@mdcluster.vosn3bz.mongodb.net/?retryWrites=true&w=majority";
const matchesUrl = uri + "/ValorantTournament/Matches";

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
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("winner")
        .setDescription("Who is the winner")
        .setRequired(true)
        .addChoices(
          {name: "Team 1", value: 1},
          {name: "Team 2", value: 2}
        )),
      
  async execute(interaction) {
    const options = interaction.options;

    const team1score = interaction.options.getInteger('team1score');
    if(team1score > 12) team1score = 12;
    const team2score = interaction.options.getInteger('team2score');
    if(team2score > 12) team2score = 12;
    try {
      await client.connect();
      console.log('Connected to MongoDB cluster successfully!');

      const dbo = client.db("ValorantTournament").collection("Matches");

      const newMatch = {
        team1: options.getRole("team1").name,
        team2: options.getRole("team2").name,
        team1score: team1score,
        team2score: team2score,
        winner: options.getInteger("winner").value
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
