import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {GameDig, type QueryResult} from 'gamedig';

import storedServerList from '../../servers.json' with {type: 'json'};

async function queryGameDig(type: string, host: string, port: number) {
    return await GameDig.query({
        type: type,
        host: host,
        port: port,
        givenPortOnly: true
    });
}

// let fromFileServerList: { type: string, host: string, port: number }[] = [];
// async function loadServerList(): Promise<{type: string, host: string, port: number}[]> {
//     const storedServerListFile = Bun.file("../../servers.json");
//     if (await storedServerListFile.exists()) {
//         return await storedServerListFile.json() as { type: string, host: string, port: number }[];
//     }
//     return [];
// }

const serverList = storedServerList;

const gameTypeMap: { [key: string]: string } = {
    "arma3": "Arma 3",
    "armareforger": "Reforger"
}

function generateEmbed(type: string, status: QueryResult) {
    return new EmbedBuilder()
        .setTitle(status.name)
        .setDescription("Running " + gameTypeMap[type] + " version: " + status.version)
        .addFields(
            {
                name: "Status",
                value: status.numplayers + "/" + status.maxplayers,
                inline: true
            },
            {
                name: "Map Code",
                value: status.map,
                inline: true
            }
        );
}

export const data = new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get Reforger Server status");

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    await injectEmbeds(interaction);
}

async function injectEmbeds(interaction: CommandInteraction) {
    let count = 0;

    for(let i = 0; i < serverList.length; i++) {
        let server = serverList[i];
        // console.log("Querying server: " + server.host + ":" + server.port);
        const status = await queryGameDig(server.type, server.host, server.port);
        // console.log("Status: " + status.name + " " + status.numplayers + "/" + status.maxplayers);
        const embed = generateEmbed(server.type, status);
        // if undefined, skip it
        if (embed) {
            count++;
            let message = await interaction.followUp({
                embeds: [embed]
            });
            let deleteHandler = async () => {
                if (message.deletable) {
                    await message.delete();
                }
            }
            setTimeout(deleteHandler, 30000);
        }
    }

    if (count == 0) {
        await interaction.followUp("No servers are currently online.");
    }
}