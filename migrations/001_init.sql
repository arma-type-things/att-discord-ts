CREATE TABLE known_guilds (
    id SERIAL PRIMARY KEY,
    guild_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bot_messages (
    id SERIAL PRIMARY KEY,
    guild_id BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (guild_id, message_id),
    FOREIGN KEY(guild_id) REFERENCES known_guilds(id) ON DELETE CASCADE
);

CREATE TABLE known_roles (
    id SERIAL PRIMARY KEY,
    guild_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    role_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(guild_id) REFERENCES known_guilds(id) ON DELETE CASCADE
);

CREATE TABLE button_messages (
    bot_message_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    custom_id TEXT NOT NULL,
    role_id BIGINT NOT NULL,
    FOREIGN KEY(role_id) REFERENCES known_roles(id) ON DELETE CASCADE,
    FOREIGN KEY(bot_message_id) REFERENCES bot_messages(id) ON DELETE CASCADE,
    FOREIGN KEY(guild_id) REFERENCES known_guilds(id) ON DELETE CASCADE
);