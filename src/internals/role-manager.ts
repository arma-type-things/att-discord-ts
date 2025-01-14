import {type Guild, MessageReaction, type User} from "discord.js";

interface BotRoleManager {
    addRoleFromInteraction(messageReaction: MessageReaction): Promise<boolean>;
    isOwnerOrAdmin(user: User, guild: Guild | undefined | null): Promise<boolean>;
}

export const roleManager: BotRoleManager = {
    addRoleFromInteraction,
    isOwnerOrAdmin
};

async function addRoleFromInteraction(messageReaction: MessageReaction): Promise<boolean> {
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
            return false;
        }
    }
    let guild = messageReaction.message.guild;
    let author = messageReaction.message.author;
    if (guild && author) {
        let roles = guild.roles;
        let emoji = messageReaction.emoji.name;
        if (emoji) {
            let role = roles.cache.find(role => role.name === emoji);
            if (role) {
                let member = guild.members.cache.get(author.id);
                if (member) {
                    await member.roles.add(role);
                    return true;
                }
            }
        }
    }
    return false;
}

async function isOwnerOrAdmin(user: User, guild: Guild | undefined | null): Promise<boolean> {
    if (user.bot || !guild) { return false; } // TODO: figure out if we allow a bot to take actions on this bot.
    if (user.id === guild.ownerId) { return true; } // short-circuit the rest of the checks.
    // TODO: find a better way to check for admin roles.
    const adminRoles: string[] = [
        'Admin',
        'admins',
        'admin',
        // 'Moderator',
        // 'mods',
        // 'moderator',
        // 'moderators'
    ];
    let adminRole = guild.roles.cache.find(role => {
        if (adminRoles.includes(role.name)) {
            return role;
        }
    });
    if (adminRole) {
        let member = guild.members.cache.get(user.id);
        if (member) {
            return member.roles.cache.has(adminRole.id);
        }
    }
    return false;
}
