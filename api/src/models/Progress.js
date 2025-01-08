const pool = require("../database/db");

class Progress {
    constructor(idPath, idUser) {
        this.idPath = idPath;
        this.idUser = idUser;
    }

    async createProgress() {
        try {
            await pool.query(
                'INSERT INTO "Progress" ("idpath", \"iduser\") VALUES ($1, $2)',
                [this.idPath, this.idUser]
            );
            console.log("Progress updated");
        } catch (error) {
            throw new Error("Error updating progress");
        }
    }

    static async deleteProgress(id) {
        try {
            await pool.query(
                'DELETE FROM "Progress" WHERE "IdProgress" = $1',
                [id]
            );
        } catch (error) {
            throw new Error("Error deleting progress");
        }
    }

    static async viewProgress(id) {
        try {
            const response = await pool.query(
                'SELECT * FROM "Progress" WHERE "IdProgress" = $1',
                [id]
            );
            return response.rows[0];
        } catch (error) {
            throw new Error("Error viewing progress");
        }
    }
}

module.exports = Progress;
