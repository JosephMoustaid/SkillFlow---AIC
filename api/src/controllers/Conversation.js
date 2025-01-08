const Conversation = require("../models/Conversation");

exports.loadMessages = async (req, res) => {
    try {
        const { idPath, messages } = req.body;
        const conversation = new Conversation(idPath, messages);
        await conversation.loadMessages();
        res.status(201).json({ message: "Messages loaded successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.deleteConversation = async (req, res) => {
    try {
        const { id } = req.params;
        await Conversation.deleteConversation(id);
        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
