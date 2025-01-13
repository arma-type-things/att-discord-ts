import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { GameDig } from 'gamedig';

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

async function generateEmbed(type: string | undefined, host: string | undefined, port: number | undefined): Promise<EmbedBuilder | undefined> {
    // make sure type, host and port are defined or return undefined
    if (!type || !host || !port) {
        return undefined;
    }
    var status = await queryGameDig(type, host, port);
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
    var embeds: EmbedBuilder[] = [];
    serverList.forEach(async server => {
        // if undefined, skip it
        var embed = await generateEmbed(server.type, server.host, server.port);
        if (embed) {
            embeds.push(embed);
        }
    });
    return interaction.reply({
        embeds: embeds 
    });
}

