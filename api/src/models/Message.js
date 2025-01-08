const pool = require("../database/db");

class Message {
    constructor(idConversation, value, isUser) {
        this.idConversation = idConversation;
        this.value = value;
        this.isUser = isUser;
    }

    async addMessage() {
        try {
            const result = await pool.query(
                'INSERT INTO "Message" ("idconversation", "value", "isuser") VALUES ($1, $2, $3) RETURNING *',
                [this.idConversation, this.value, this.isUser]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error("Error adding message");
        }
    }
}

module.exports = Message;
