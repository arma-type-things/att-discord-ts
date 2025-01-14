import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { dataStore} from "./internals/datastore.ts";
import { roleManager } from "./internals/role-manager.ts";
import { deployCommands } from "./deploy-commands";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.once("ready", () => {
  console.log("🤖 And I'm ready...");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN).then(() => console.log("🤖 I'm alive..."));