const ToDoList = require("../models/ToDoList");

exports.createToDoList = async (req, res) => {
    try {
        const { idPath, tasks } = req.body;
        const todoList = new ToDoList(idPath, tasks);
        await todoList.createToDoList();
        res.status(201).json({ message: "ToDoList created successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.updateToDoList = async (req, res) => {
    try {
        const { id } = req.params;
        const { tasks } = req.body;
        await ToDoList.updateToDoList(id, tasks);
        res.status(200).json({ message: "ToDoList updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.removeToDoList = async (req, res) => {
    try {
        const { id } = req.params;
        await ToDoList.removeToDoList(id);
        res.status(200).json({ message: "ToDoList removed successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.viewToDoList = async (req, res) => {
    try {
        const { id } = req.params;
        const todoList = await ToDoList.viewToDoList(id);
        res.status(200).json({ message: "ToDoList found successfully", todoList });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
