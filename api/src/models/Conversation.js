const pool = require("../database/db");

class Conversation {
    constructor(idPath, messages) {
        this.idPath = idPath;
        this.messages = messages;
    }

    async loadMessages() {
        try {
            await pool.query(
                'INSERT INTO "Conversation" ("idpath", "messages") VALUES ($1, $2)',
                [this.idPath, this.messages]
            );
            console.log("Conversation initialized");
        } catch (error) {
            throw new Error("Error loading messages");
        }
    }

    static async deleteConversation(id) {
        try {
            await pool.query(
                'DELETE FROM "Conversation" WHERE "IdConversation" = $1',
                [id]
            );
        } catch (error) {
            throw new Error("Error deleting conversation");
        }
    }
}

module.exports = Conversation;
