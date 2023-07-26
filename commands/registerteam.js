const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const {uri} = require("../config.json");

const client = new MongoClient(uri);

function roundToNearestTen(number) {
    const remainder = number % 10;
    if (remainder < 5) {
      return number - remainder;
    } else {
      return number + (10 - remainder);
    }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registerteam')
    .setDescription('Register a team to the database')
    .addStringOption(option =>
      option.setName("teamname")
        .setDescription("Team name")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("teamrank1")
        .setDescription("First person's peak rank")
        .setRequired(true)
        .addChoices(
            { name: 'Unranked', value: 0},
            { name: 'Iron', value: 0},
            { name: 'Bronze', value: 10},
            { name: 'Silver', value: 20},
            { name: 'Gold', value: 30},
            { name: 'Platinum', value: 40},
            { name: 'Diamond', value: 50},
            { name: 'Ascendant', value: 60},
            { name: 'Immortal', value: 70},
            { name: 'Radiant', value: 80},
        ))
    .addIntegerOption(option =>
      option.setName("teamrank2")
        .setDescription("Second person's peak rank")
        .setRequired(true)
        .addChoices(
            { name: 'Unranked', value: 0},
            { name: 'Iron', value: 0},
            { name: 'Bronze', value: 10},
            { name: 'Silver', value: 20},
            { name: 'Gold', value: 30},
            { name: 'Platinum', value: 40},
            { name: 'Diamond', value: 50},
            { name: 'Ascendant', value: 60},
            { name: 'Immortal', value: 70},
            { name: 'Radiant', value: 80},
        ))
    .addIntegerOption(option =>
      option.setName("teamrank3")
        .setDescription("Third person's peak rank")
        .setRequired(true)
        .addChoices(
            { name: 'Unranked', value: 0},
            { name: 'Iron', value: 0},
            { name: 'Bronze', value: 10},
            { name: 'Silver', value: 20},
            { name: 'Gold', value: 30},
            { name: 'Platinum', value: 40},
            { name: 'Diamond', value: 50},
            { name: 'Ascendant', value: 60},
            { name: 'Immortal', value: 70},
            { name: 'Radiant', value: 80},
        )),
      
  async execute(interaction) {
    const options = interaction.options;
    var teamMdp;
    try {
      await client.connect();
      console.log('Connected to MongoDB cluster successfully!');

      const dbo = client.db("ValorantTournament").collection("StarterTeams");
      const dbo2 = client.db("ValorantTournament").collection("Teams");
        
      teamMdp = roundToNearestTen(((options.getInteger("teamrank1") + options.getInteger("teamrank2") + options.getInteger("teamrank3"))/3).toFixed(2))
      const newMatch = {
        teamname: options.getString("teamname"),
        player1peak: options.getInteger("teamrank1"),
        player2peak: options.getInteger("teamrank2"),
        player3peak: options.getInteger("teamrank3"),
        teammdp: teamMdp,
      };

      const result = await dbo.insertOne(newMatch);
      await dbo2.insertOne(newMatch);
      console.log(`Document inserted with _id: ${result.insertedId}`);
    } catch (error) {
      console.error('Error inserting document:', error);
    } finally {
      client.close();
    }

    await interaction.reply('Team successfully registered with MDP: '+teamMdp);
  },
};
