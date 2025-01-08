const Progress = require("../models/Progress");

exports.createProgress = async (req, res) => {
    try {
        const { idPath,idUser } = req.body;
        const progress = new Progress(idPath,idUser);
        await progress.createProgress();
        res.status(201).json({ message: "Progress created successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.deleteProgress = async (req, res) => {
    try {
        const { id } = req.params;
        await Progress.deleteProgress(id);
        res.status(200).json({ message: "Progress deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.viewProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const progress = await Progress.viewProgress(id);
        res.status(200).json({ message: "Progress found successfully", progress });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
