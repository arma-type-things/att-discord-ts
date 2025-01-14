import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { GameDig, type QueryResult } from 'gamedig';

import storedServerList from '../../servers.json' with { type: "json" };

async function queryGameDig(type: string, host: string, port: number) {
    const result = await GameDig.query({
        type: type,
        host: host,
        port: port,
        givenPortOnly: true
    });

    return result;
}

const defaultServerList: [{
    type: string,
    host: string,
    port: number
}] = [
    {
        "type": "armareforger",
        "host": "172.96.164.58",
        "port": 7931
    }
]

var serverList = storedServerList || defaultServerList;

// map of string to string representing the game type and what to display in the embed
const gameTypeMap: { [key: string]: string } = {
    "arma3": "Arma 3",
    "armareforger": "Reforger"
}

function generateEmbed(type: string, status: QueryResult) {
    // make sure type, host and port are defined or return undefined
    // if (!type || !host || !port) {
    //     return undefined;
    // }
    // var status = await queryGameDig(type, host, port);
    const embed = new EmbedBuilder()
        .setTitle(status.name)
        .setDescription("Running " + gameTypeMap[type] + " version: " + status.version)
        .addFields(
            {
                name: "Status",
                value: status.numplayers + "/" + status.maxplayers,
                inline: true
            },
            // Allow connect info in configuration json; TODO
            // {
            //     name: "Connection Info",
            //     value: status.connect,
            //     inline: true
            // },
            {
                name: "Map Code",
                value: status.map,
                inline: true
            }
        );
    return embed;
}

export const data = new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get Reforger Server status");

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const embeds = await gatherEmbeds(serverList);
    if (embeds.length === 0) {
        return interaction.editReply("No servers available");
    }
    return interaction.editReply({
        embeds: embeds 
    });
}

async function gatherEmbeds(servers: {
    type: string,
    host: string,
    port: number
}[]) {
    var embeds: EmbedBuilder[] = [];
    servers.forEach(async server => {
        console.log("Querying server: " + server.host + ":" + server.port);
        var status = await queryGameDig(server.type, server.host, server.port);
        console.log("Status: " + status);
        var embed = generateEmbed(server.type, status);
        // if undefined, skip it
        if (embed) {
            embeds.push(embed);
        }
    });
    return embeds;
}

