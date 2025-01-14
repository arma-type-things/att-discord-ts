import { Database } from 'bun:sqlite';
import { hash } from 'crypto';
import { Message, Guild } from 'discord.js';
import { migrate, getMigrations } from 'bun-sqlite-migrations'
import { config } from '../config';

interface DataStore {
    initGuild(guild: Guild): void;
    purgeGuild(guild: Guild): void;
    storeBotSentMessage(message: Message): void; // TODO: storeButton ? only messages we care about.
}

export const dataStore: DataStore = {
    initGuild(guild: Guild): void {},
    purgeGuild(guild: Guild): void {},
    storeBotSentMessage
}

const db = new Database(config.DATABASE_FILE);
migrate(db, getMigrations('migrations'));

function hashMessage(message: Message) {
    return hash('sha256', message.content, 'hex');
}

function compareToHash(message: Message, hash: string) {
    return hashMessage(message) === hash;
}

export function storeBotSentMessage(message: Message) {
    let query = db.query('INSERT INTO bot_messages (message_hash, content) VALUES (?, ?)');
    query.run(hashMessage(message), message.content);
}