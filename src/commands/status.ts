import { CommandInteraction, SlashCommandBuilder, Embed } from "discord.js";
import { GameDig } from 'gamedig';

async function queryGameDig() {
    const result = await GameDig.query({
        type: 'armareforger',
        host: '172.96.164.58',
        port: 7931,
        givenPortOnly: true
    });

    return result;
}

async function generateEmbed() {
    var status = await queryGameDig();
    return {
        title: status.name,
        description: "Running version: " + status.version,
        fields: [
            {
                name: "Status",
                value: status.numplayers + "/" + status.maxplayers
            },
            // Allow connect info in configuration json; TODO
            // {
            //     name: "Connection Info",
            //     value: status.connect
            // },
            {
                name: "Map Code",
                value: status.map
            }
        ]
    }
}

export const data = new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get Reforger Server status");

export async function execute(interaction: CommandInteraction) {
    var embed = await generateEmbed();
    return interaction.reply({
        embeds: [embed] 
    });
}

