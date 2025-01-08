const pool = require("../database/db");

class Task {
    constructor(idToDoList, name, isFinished = false) {
        this.idToDoList = idToDoList;
        this.name = name;
        this.isFinished = isFinished;
    }

    async addTask() {
        try {
            await pool.query(
                'INSERT INTO "Task" ("IdToDoList", "Name", "IsFinished") VALUES ($1, $2, $3)',
                [this.idToDoList, this.name, this.isFinished]
            );
            console.log("Task added");
        } catch (error) {
            throw new Error("Error adding task");
        }
    }

    static async updateTask(id, fields) {
        try {
            const keys = Object.keys(fields);
            const values = Object.values(fields);
            const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(", ");
            values.push(id);

            await pool.query(
                `UPDATE "Task" SET ${setClause} WHERE "IdTask" = $${values.length}`,
                values
            );
        } catch (error) {
            throw new Error("Error updating task");
        }
    }

    static async removeTask(id) {
        try {
            await pool.query('DELETE FROM "Task" WHERE "IdTask" = $1', [id]);
        } catch (error) {
            throw new Error("Error removing task");
        }
    }

    static async viewTask(id) {
        try {
            const response = await pool.query('SELECT * FROM "Task" WHERE "IdTask" = $1', [id]);
            return response.rows[0];
        } catch (error) {
            throw new Error("Error viewing task");
        }
    }
}

module.exports = Task;
