const bcrypt = require("bcrypt");
const runQuery = require("../db/db-manager");

const userService = {
    create: async (user) => {
        const existedUser = await userService.getUserByUsername(user.username);
        if (existedUser) {
            throw new Error("User already exists");
        }

        let hashedPassword = bcrypt.hashSync(user.password, 10);

        const result = await runQuery(`
            insert into users (username, password)
            values ($1, $2)
        `, [user.username, hashedPassword])
        return await result.rows[0]

    },
    update: (id, user) => {
    },
    getUserByUsername: async (username) => {
        const user = await runQuery(`
            select *
            from users
            where username = $1
        `, [username]);

        return await user.rows[0];
    },
    authenticate: async (username, password) => {
        let user = await userService.getUserByUsername(username);
        if (!user) {
            throw new Error("Invalid username or password");
        }

        let isPasswordSame = await bcrypt.compareSync(password, user.password);
        if (!isPasswordSame) {
            throw new Error("Invalid username or password");
        }

        return user;
    },
    getUser: (id) => {
    },
    getAll: async () => {
        const query = `
            SELECT id, username, avatar_link
            FROM users;
        `
        const result = await runQuery(query);
        return result.rows;
    },
}

module.exports = userService;