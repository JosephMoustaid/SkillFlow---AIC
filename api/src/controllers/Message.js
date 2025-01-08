const Message = require("../models/Message");

exports.addMessage = async (req, res) => {
    try {
        const { idConversation, content, isUser } = req.body;
        const message = new Message(idConversation, content, isUser);
        const newMessage = await message.addMessage();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
