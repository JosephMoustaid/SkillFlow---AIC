const pool = require("../database/db");

class ToDoList {
    constructor(idPath, tasks) {
        this.idPath = idPath;
        this.tasks = tasks;
    }

    async createToDoList() {
        try {
            await pool.query(
                'INSERT INTO "ToDoList" ("idpath", "tasks") VALUES ($1, $2)',
                [this.idPath, this.tasks]
            );
            console.log("ToDoList created");
        } catch (error) {
            throw new Error("Error creating ToDoList");
        }
    }

    static async updateToDoList(id, tasks) {
        try {
            await pool.query(
                'UPDATE "ToDoList" SET "Tasks" = $1 WHERE "IdToDoList" = $2',
                [tasks, id]
            );
        } catch (error) {
            throw new Error("Error updating ToDoList");
        }
    }

    static async removeToDoList(id) {
        try {
            await pool.query(
                'DELETE FROM "ToDoList" WHERE "IdToDoList" = $1',
                [id]
            );
        } catch (error) {
            throw new Error("Error removing ToDoList");
        }
    }

    static async viewToDoList(id) {
        try {
            const response = await pool.query(
                'SELECT * FROM "ToDoList" WHERE "IdToDoList" = $1',
                [id]
            );
            return response.rows[0];
        } catch (error) {
            throw new Error("Error viewing ToDoList");
        }
    }
}

module.exports = ToDoList;
