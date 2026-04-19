CREATE TABLE users
(
    id          serial primary key,
    username    varchar NOT NULL unique,
    password    varchar,
    avatar_link varchar
);

CREATE TABLE chats
(
    id        serial primary key,
    name      varchar,
    image_url varchar
);

CREATE TABLE chat_members
(
    id      serial primary key,
    user_id int,
    chat_id int,

    foreign key (user_id) references users(id),
    foreign key (chat_id) references chats(id)
);

CREATE TABLE messages
(
    id      serial primary key,
    text    varchar NOT NULL,
    created timestamp,
    user_id int,
    chat_id int,

    foreign key (user_id) references users (id),
    foreign key (chat_id) references chats (id)
);