const pool = require("../db/db-manager");

let chatService = {
    create: async (name, imageUrl, owner) => {
        const createQuery = `
            INSERT INTO chats(name, image_url)
            VALUES ($1, $2)
        `

        const result = await pool.query(createQuery, [name, imageUrl])
        const chatId = result.rows[0].id

        chatService.addMembers(chatId, [owner])
        return result.rows[0];
    },
    addMembers: (chatId, members) => {
        const addMembersQuery = `
            INSERT INTO chat_members (user_id, chat_id)
            VALUES ($1, $2)
        `;

        members.forEach((member) => {
            pool.query(addMembersQuery, [member, chatId])
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

        return await pool.query(query, [userId]).rows
    },
    getById: (id) => {

    },
    update: () => {
    },
}

module.exports = chatService