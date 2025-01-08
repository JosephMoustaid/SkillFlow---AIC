const pool = require("../database/db");

class Path {
    constructor(name, sector, idUser) {
        this.name = name;
        this.sector = sector;
        this.idUser = idUser;
    }

    async createPath() {
        try {
            const result = await pool.query(
                'INSERT INTO "Path" ("name", "sector", "idUser") VALUES ($1, $2, $3) RETURNING *',
                [this.name, this.sector, this.idUser]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error("Error creating path");
        }
    }

    static async getUserPaths(idUser) {
        try {
            const result = await pool.query(
                'SELECT * FROM "Path" WHERE "idUser" = $1',
                [idUser]
            );
            return result.rows;
        } catch (error) {
            throw new Error("Error fetching user paths");
        }
    }

    static async deletePath(id) {
        try {
            await pool.query('DELETE FROM "Path" WHERE "idPath" = $1', [id]);
        } catch (error) {
            throw new Error("Error deleting path");
        }
    }

    static async continuePath(id) {
        try {
            const response = await pool.query(
                'SELECT * FROM "Path" WHERE "idPath" = $1',
                [id]
            );
            return response.rows[0];
        } catch (error) {
            throw new Error("Error continuing path");
        }
    }

    static async getPath(id) {
        try {
            const pathResponse = await pool.query(
                'SELECT * FROM "Path" WHERE "idpath" = $1',
                [id]
            );
            const path = pathResponse.rows[0];

            const toDoListResponse = await pool.query(
                'SELECT * FROM "ToDoList" WHERE "idpath" = $1',
                [id]
            );
            const toDoList = toDoListResponse.rows[0];

            if (toDoList) {
                const tasksResponse = await pool.query(
                    'SELECT * FROM "Task" WHERE "idtodolist" = $1',
                    [toDoList.idtodolist]
                );
                toDoList.tasks = tasksResponse.rows;
            }

            const conversationResponse = await pool.query(
                'SELECT * FROM "Conversation" WHERE "idpath" = $1',
                [id]
            );
            const conversation = conversationResponse.rows[0];

            if (conversation) {
                const messagesResponse = await pool.query(
                    'SELECT * FROM "Message" WHERE "idconversation" = $1',
                    [conversation.idconversation]
                );
                conversation.messages = messagesResponse.rows;
            }

            return { path, toDoList, conversation };
        } catch (error) {
            throw new Error("Error fetching path data");
        }
    }
}

module.exports = Path;
