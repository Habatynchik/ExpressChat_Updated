const pool = require("../db/db-manager");
const {runQuery} = require("../db/db-manager");

let chatService = {
    create: async (name, imageUrl, owner) => {
        const createQuery = `
            INSERT INTO chats(name, image_url)
            VALUES ($1, $2)
            RETURNING  *;
        `

        const result = await runQuery(createQuery, [name, imageUrl])
        const chatId = result.rows[0]

        chatService.addMembers(chatId.id, [owner])
        return result.rows[0];
    },
    addMembers: (chatId, members) => {
        const addMembersQuery = `
            INSERT INTO chat_members (user_id, chat_id)
            VALUES ($1, $2)
            RETURNING *;
        `;

        members.forEach((member) => {
            runQuery(addMembersQuery, [member, chatId])
        })

        return true;
    },
    getAllByUserId: async (userId) => {
        const query = `
            SELECT c.*
            from chats c
                     JOIN chat_members cm on cm.chat_id = c.id
            WHERE cm.user_id = $1;
        `

        const result = await runQuery(query, [userId]);
        return result.rows;
    },
    getById: (id) => {

    },
    update: () => {
    },
}

module.exports = chatService