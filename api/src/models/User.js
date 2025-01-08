const pool = require("../database/db");
const jwt = require('jsonwebtoken');

class User {
    constructor(firstName, lastName, email, password , preference) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.preference = preference;
    }

    async signUp() {
        try {
            await pool.query(
                'INSERT INTO "User" ("firstname", "lastname", "email", "password","preference") VALUES ($1, $2, $3, $4,$5)',
                [this.firstName, this.lastName, this.email, this.password,this.preference]
            );
            console.log("User signed up");
        } catch (error) {
            throw new Error("Error signing up user");
        }
    }

    static async signIn(email, password) {
        try {
            const response = await pool.query(
                'SELECT * FROM "User" WHERE "email" = $1 AND "password" = $2',
                [email, password]
            );
            const token = jwt.sign(
                { id: response.rows[0].iduser },
                'Token_Secret',
                { expiresIn: '24h' }
              );
            return token;
        } catch (error) {
            throw new Error("Error signing in user");
        }
    }
}

module.exports = User;
