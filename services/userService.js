const bcrypt = require("bcrypt");

const userService = {
    create: async (user) => {
        const existedUser = await userService.getUserByUsername(user.username);
        if (existedUser) {
            throw new Error("User already exists");
        }

        let hashedPassword = bcrypt.hashSync(user.password, 10);

        const result = await pool.query(`
            insert into users (username, password)
            values ($1, $2)
        `, [user.username, hashedPassword])
        return result.rows[0]

    },
    update: (id, user) => {
    },
    getUserByUsername: async (username) => {
        let user = await pool.query(`
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
    getAll: () => {
    },
}

module.exports = userService;