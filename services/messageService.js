const pool = require("../db/db-manager");
const {runQuery} = require("../db/db-manager");

let messageService = {
    getAllByChatId: async (chatId) => {
        const query = `
            SELECT messages.id, messages.text, messages.created, messages.user_id, messages.chat_id, users.username
            FROM messages
            JOIN users ON users.id = messages.user_id
            WHERE messages.chat_id = $1
            ORDER BY messages.created ASC
        `;
        
        const result = await runQuery(query, [chatId]);
        return result.rows;
    },
    createMessage: async (chatId, message, userId) => {
        const query = `
            INSERT INTO messages (user_id, chat_id, text, created)
            VALUES ($1, $2, $3, now())
            RETURNING *
        `
        const result = await runQuery(query, [userId, chatId, message]);
        return result.rows[0];
    },
    deleteAllByChatId: async (chatId) => {
        const query = `
            DELETE FROM messages
            WHERE chat_id = $1
            RETURNING id
        `;

        const result = await runQuery(query, [chatId]);
        return result.rowCount;
    }
};

module.exports = messageService;