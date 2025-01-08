const Path = require("../models/Path");

exports.createPath = async (req, res) => {
    try {
        const { name, sector } = req.body;
        const idUser = req.user.id; // Assuming you have middleware to set req.user
        console.log(idUser);
        const path = new Path(name, sector, idUser);
        const newPath = await path.createPath();
        res.status(201).json(newPath);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.getUserPaths = async (req, res) => {
    try {
        const idUser = req.user.id; // Assuming you have middleware to set req.user
        const userPaths = await Path.getUserPaths(idUser);
        res.status(200).json(userPaths);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.deletePath = async (req, res) => {
    try {
        const { id } = req.params;
        await Path.deletePath(id);
        res.status(200).json({ message: "Path deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.continuePath = async (req, res) => {
    try {
        const { id } = req.params;
        const path = await Path.continuePath(id);
        res.status(200).json({ message: "Path continued successfully", path });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.getPath = async (req, res) => {
    try {
        const { id } = req.params;
        const pathData = await Path.getPath(id);
        res.status(200).json(pathData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
