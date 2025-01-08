const Task = require("../models/Task");

exports.addTask = async (req, res) => {
    try {
        const { idToDoList, name, isFinished } = req.body;
        const task = new Task(idToDoList, name, isFinished);
        await task.addTask();
        res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const fields = req.body;
        await Task.updateTask(id, fields);
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.removeTask = async (req, res) => {
    try {
        const { id } = req.params;
        await Task.removeTask(id);
        res.status(200).json({ message: "Task removed successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.viewTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.viewTask(id);
        res.status(200).json({ message: "Task found successfully", task });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
