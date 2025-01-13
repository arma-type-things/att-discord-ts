import { CommandInteraction, SlashCommandBuilder, Embed } from "discord.js";
import { GameDig } from 'gamedig';

async function queryGameDig(type: string, host: string, port: number) {
    const result = await GameDig.query({
        type: type,
        host: host,
        port: port,
        givenPortOnly: true
    });

    return result;
}

// map of string to string representing the game type and what to display in the embed
const gameTypeMap: { [key: string]: string } = {
    "arma3": "Arma 3",
    "armareforger": "Reforger"
}

async function generateEmbed(type: string | undefined, host: string | undefined, port: number | undefined) {
    // make sure type, host and port are defined or return undefined
    if (!type || !host || !port) {
        return undefined;
    }
    var status = await queryGameDig(type, host, port);
    return {
        title: status.name,
        description: "Running " + gameTypeMap[type] + " version: " + status.version,
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
    // TODO: load this from configuration
    var type = 'armareforger';
    var host = '172.96.164.58';
    var port = 7931;
    var embed = await generateEmbed(type, host, port);
    if (!embed) {
        return interaction.reply({
            content: "Server status is not available",
            ephemeral: true
        });
    }
    return interaction.reply({
        embeds: [embed] 
    });
}

